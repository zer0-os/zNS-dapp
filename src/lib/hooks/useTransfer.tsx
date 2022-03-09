//- React Import
import { useMemo, useCallback } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';

// - Library Imports
import { useZnsContracts } from 'lib/contracts';
import { TransferSubmitParams } from 'lib/types';
import useNotification from 'lib/hooks/useNotification';

//- Hooks
import { useTransferRedux } from 'store/transfer/hooks';

//- Constant Imports
import constants, {
	getTransferSuccessMessage,
} from 'containers/flows/TransferOwnership/TransferOwnership.constants';

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
			const successNotification = getTransferSuccessMessage(params.name);

			if (!account) {
				console.error(constants.MESSAGES.REQUEST_NO_WALLET);
				return;
			}
			if (account.toLowerCase() !== params.ownerId.toLowerCase()) {
				console.error(constants.MESSAGES.REQUEST_NOT_OWNER);
				return;
			}

			try {
				const tx = await registryContract.transferFrom(
					account,
					params.walletAddress,
					params.domainId,
				);

				// start transferring
				addNotification(constants.MESSAGES.REQUEST_TRANSFER_STARTED);
				reduxActions.setTransferring(params);
				params.onClose();

				// in transferring
				await tx.wait();

				// completed transferring
				addNotification(successNotification);
				reduxActions.setTransferred(params);
			} catch (err) {
				addNotification(constants.MESSAGES.REQUEST_ERROR);
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
