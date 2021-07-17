import { useZnsContracts } from 'lib/contracts';
import { ethers } from 'ethers';
import { tryFunction } from 'lib/utils';

export interface SingleApprovalParams {
	operator: string;
	tokenId: number;
}

export interface ForAllApprovalParams {
	operator: string;
	approved: boolean;
}

export interface GetTokenOperatorParams {
	tokenId: number;
}

export interface IsApprovedForAllTokensParams {
	owner: string;
	operator: string;
}

interface ApproveNFTHook {
	approveSingleToken: (
		params: SingleApprovalParams,
	) => Promise<ethers.ContractTransaction>;
	approveAllTokens: (
		params: ForAllApprovalParams,
	) => Promise<ethers.ContractTransaction>;
	getTokenOperator: (params: GetTokenOperatorParams) => Promise<string>;
	isApprovedForAllTokens: (
		params: IsApprovedForAllTokensParams,
	) => Promise<boolean>;
}

export function useApprovals(): ApproveNFTHook {
	const registry = useZnsContracts()?.registry;

	const approveSingleToken = async (params: SingleApprovalParams) => {
		const tx = await tryFunction(async () => {
			if (!registry) {
				throw Error(`no registry`);
			}

			const tx = await registry.approve(params.operator, params.tokenId);

			return tx;
		}, `Send Single Approval`);

		return tx;
	};

	const approveAllTokens = async (params: ForAllApprovalParams) => {
		const tx = await tryFunction(async () => {
			if (!registry) {
				throw Error(`no registry`);
			}

			const tx = await registry.setApprovalForAll(
				params.operator,
				params.approved,
			);

			return tx;
		}, `Send Approval for All`);

		return tx;
	};

	const getTokenOperator = async (params: GetTokenOperatorParams) => {
		const tx = await tryFunction(async () => {
			if (!registry) {
				throw Error(`no registry`);
			}

			const tx = await registry.getApproved(params.tokenId);
			return tx;
		}, `Send check for approved operator`);

		return tx;
	};

	const isApprovedForAllTokens = async (
		params: IsApprovedForAllTokensParams,
	) => {
		const tx = await tryFunction(async () => {
			if (!registry) {
				throw Error(`no registry`);
			}

			const tx = await registry.isApprovedForAll(params.owner, params.operator);
			return tx;
		}, `Send check for approved operator for all tokens`);

		return tx;
	};

	return {
		approveSingleToken,
		approveAllTokens,
		getTokenOperator,
		isApprovedForAllTokens,
	};
}
