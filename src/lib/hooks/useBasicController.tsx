import { useZnsContracts } from 'lib/contracts';
import { Maybe } from 'lib/types';
import { ethers } from 'ethers';

export interface RegisterSubdomainParams {
	parentId: string;
	label: string;
	owner: string;
	metadataUri: string;
	isLocked: boolean;
}

export function useBasicController() {
	const basicController = useZnsContracts()?.basicController;

	const registerSubdomain = async (
		params: RegisterSubdomainParams,
	): Promise<ethers.ContractTransaction> => {
		// register subdomain
		let tx: Maybe<ethers.ContractTransaction>;
		try {
			tx = await basicController!.registerSubdomainExtended(
				params.parentId,
				params.label,
				params.owner,
				params.metadataUri,
				0,
				params.isLocked,
			);
		} catch (e) {
			console.error(e);
			if (e.code === 4001) {
				throw Error(`Transaction rejected by wallet.`);
			}
			throw Error(`Failed to submit transaction.`);
		}

		return tx;
	};

	return { registerSubdomain };
}
