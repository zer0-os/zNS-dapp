import { useMemo, useCallback } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { useZnsContracts } from 'lib/contracts';
import { TransferSubmitParams } from 'lib/types';
import useNotification from 'lib/hooks/useNotification';
import { useTransferRedux } from 'store/transfer/hooks';

export type UseTransferReturn = {
	transferring: TransferSubmitParams[];
	transferred: TransferSubmitParams[];
	transferRequest: (params: TransferSubmitParams) => void;
};

export const useTransfer = (): UseTransferReturn => {
	const { addNotification } = useNotification();

	const { reduxState, reduxActions } = useTransferRedux();

	const registryContract = useZnsContracts()!.registry;

	const walletContext = useWeb3React<Web3Provider>();
	const { account } = walletContext;

	const transferRequest = useCallback(
		async (params: TransferSubmitParams) => {
			if (!account) {
				console.error('No wallet detected');
				return;
			}
			if (account.toLowerCase() !== params.ownerId.toLowerCase()) {
				console.error('You are not the owner');
				return;
			}

			try {
				const tx = await registryContract.transferFrom(
					account,
					params.walletAddress,
					params.domainId,
				);

				// start transferring
				addNotification('Started transfer');
				reduxActions.setTransferring(params);

				// in transferring
				await tx.wait();

				// completed transferring
				addNotification(`Ownership of "${params.name}" has been transferred`);
				reduxActions.setTransferred(params);
			} catch (err) {
				addNotification('Encountered an error while attempting to transfer.');
				throw err;
			}
		},
		[account, registryContract, reduxActions, addNotification],
	);

	return useMemo(
		() => ({
			transferring: reduxState.transferring,
			transferred: reduxState.transferred,
			transferRequest,
		}),
		[reduxState, transferRequest],
	);
};
