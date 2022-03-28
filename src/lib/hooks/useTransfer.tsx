//- React Import
import { useMemo, useCallback } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';

// - Library Imports
import { TransferSubmitParams } from 'lib/types';
import useNotification from 'lib/hooks/useNotification';

//- Hooks
import { useTransferRedux } from 'store/transfer/hooks';

//- Constant Imports
import {
	getTransferSuccessMessage,
	MESSAGES,
} from 'containers/flows/TransferOwnership/TransferOwnership.constants';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';

export type UseTransferReturn = {
	transferring: TransferSubmitParams[];
	transferred: TransferSubmitParams[];
	transferRequest: (params: TransferSubmitParams) => void;
};

export const useTransfer = (): UseTransferReturn => {
	const { addNotification } = useNotification();
	const { instance: sdk } = useZnsSdk();

	const { reduxState, reduxActions } = useTransferRedux();

	const walletContext = useWeb3React<Web3Provider>();
	const { account, library } = walletContext;

	const transferRequest = useCallback(
		async (params: TransferSubmitParams) => {
			const successNotification = getTransferSuccessMessage(params.name);

			if (!account || !library) {
				console.error(MESSAGES.REQUEST_NO_WALLET);
				return;
			}
			if (account.toLowerCase() !== params.ownerId.toLowerCase()) {
				console.error(MESSAGES.REQUEST_NOT_OWNER);
				return;
			}

			if (account.toLowerCase() === params.walletAddress.toLowerCase()) {
				console.error(MESSAGES.REQUEST_ADDRESS_NOT_VALID_ERROR);
				return;
			}

			try {
				const tx = await sdk.transferDomainOwnership(
					params.walletAddress,
					params.domainId,
					library.getSigner(),
				);

				// start transferring
				addNotification(MESSAGES.REQUEST_TRANSFER_STARTED);
				reduxActions.setTransferring(params);
				params.onClose();

				// in transferring
				await tx.wait();

				// completed transferring
				addNotification(successNotification);
				reduxActions.setTransferred(params);
			} catch (err) {
				console.warn(err);
				addNotification(MESSAGES.REQUEST_ERROR);
				throw err;
			}
		},
		[account, library, sdk, reduxActions, addNotification],
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
