/*
 * This hook could be changed into a helper, as
 * it doesn't require internal state
 */

//- React Imports
import { useState } from 'react';

//- Library Imports
import { useWeb3React } from '@web3-react/core';
import { Bid } from '@zero-tech/zauction-sdk';
import { useZnsSdk } from 'lib/hooks/sdk';

//- Utils Imports
import { getDisplayErrorMessage } from 'lib/utils/error';

//- Constants Imports
import constants from '../CancelBid.constants';
import { ZAuctionVersionType } from '../CancelBid.types';
import { ERRORS } from 'constants/errors';

export type UseCancelBidReturn = {
	cancel: (bid: Bid) => Promise<void>;
	status?: string;
};

const useCancelBid = (): UseCancelBidReturn => {
	const { library } = useWeb3React();
	const { instance: sdk } = useZnsSdk();

	const [status, setStatus] = useState<string | undefined>();

	const cancel = async (bid: Bid) => {
		const bidWaitingStatus =
			bid.version === ZAuctionVersionType.V1
				? constants.MESSAGES.TEXT_WAITING_FOR_WALLET_V1
				: constants.MESSAGES.TEXT_WAITING_FOR_WALLET_V2;

		const cancelBidOnChain =
			bid.version === ZAuctionVersionType.V1 ? false : true;

		if (!library) {
			console.error(ERRORS.LIBRARY_NOT_FOUND);
			throw new Error(ERRORS.LIBRARY);
		}

		try {
			// Signature request
			setStatus(bidWaitingStatus);
			let tx;
			try {
				tx = await sdk.zauction.cancelBid(
					bid.bidNonce,
					bid.signedMessage,
					bid.tokenId,
					cancelBidOnChain,
					library.getSigner(),
				);
			} catch (e: any) {
				console.error(e);
				throw new Error(getDisplayErrorMessage(e.message));
			}

			// Transaction request
			try {
				setStatus(constants.MESSAGES.TEXT_CANCELLING_BID);
				await tx?.wait();
				setStatus(undefined);
			} catch (e) {
				console.error(e);
				throw new Error(ERRORS.TRANSACTION);
			}
		} catch (e) {
			setStatus(undefined);
			throw e;
		}
	};

	return {
		cancel,
		status,
	};
};

export default useCancelBid;
