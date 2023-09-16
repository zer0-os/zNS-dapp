//- React Import
import { useCallback, useMemo } from 'react';

//- Web3 Imports
import { useWeb3 } from 'lib/web3-connection/useWeb3';

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
import { useZnsSdk } from 'lib/hooks/sdk';

export type UseTransferReturn = {
	transferring: TransferSubmitParams[];
	transferred: TransferSubmitParams[];
	transferRequest: (params: TransferSubmitParams) => void;
};

export const useTransfer = (): UseTransferReturn => {
	const { addNotification } = useNotification();
	const { instance: sdk } = useZnsSdk();

	const { reduxState, reduxActions } = useTransferRedux();

	const walletContext = useWeb3();
	const { account, provider } = walletContext;

	const transferRequest = useCallback(
		async (params: TransferSubmitParams) => {
			const successNotification = getTransferSuccessMessage(params.name);

			if (!account || !provider) {
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
					provider.getSigner(),
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
		[account, provider, sdk, reduxActions, addNotification],
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
