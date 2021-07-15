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

interface ApproveNFTHook {
	approveSingleToken: (
		params: SingleApprovalParams,
	) => Promise<ethers.ContractTransaction>;
	approveAllTokens: (
		params: ForAllApprovalParams,
	) => Promise<ethers.ContractTransaction>;
}

export function useApprovals(): ApproveNFTHook {
	const registry = useZnsContracts()?.registry;

	const approveSingleToken = async (params: SingleApprovalParams) => {
		const tx = await tryFunction(async () => {
			if (!registry) {
				throw Error(`no registry`);
			}

			// Send the Approval for a single NFT
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

			// Send the Approval for All
			const tx = await registry.setApprovalForAll(
				params.operator,
				params.approved,
			);

			return tx;
		}, `Send Approval for All`);

		return tx;
	};

	return { approveSingleToken, approveAllTokens };
}
