/*
 * This hook could be changed into a helper, as
 * it doesn't require internal state
 */

//- React Imports
import { useState } from 'react';

//- Library Imports
import { useWeb3 } from 'lib/web3-connection/useWeb3';
import { Bid } from '@zero-tech/zauction-sdk';
import { useZnsSdk } from 'lib/hooks/sdk';

//- Constants Imports
import constants from '../CancelBid.constants';
import { ZAuctionVersionType } from '../CancelBid.types';

export type UseCancelBidReturn = {
	cancel: (bid: Bid) => Promise<void>;
	status?: string;
};

const useCancelBid = (): UseCancelBidReturn => {
	const { provider } = useWeb3();
	const { instance: sdk } = useZnsSdk();

	const [status, setStatus] = useState<string | undefined>();

	const cancel = async (bid: Bid) => {
		const bidWaitingStatus =
			bid.version === ZAuctionVersionType.V1
				? constants.MESSAGES.TEXT_WAITING_FOR_WALLET_V1
				: constants.MESSAGES.TEXT_WAITING_FOR_WALLET_V2;

		const cancelBidOnChain =
			bid.version === ZAuctionVersionType.V1 ? false : true;

		if (!provider) {
			console.error(constants.ERRORS.CONSOLE);
			throw new Error(constants.ERRORS.LIBRARY);
		}

		try {
			// Signature request
			setStatus(bidWaitingStatus);
			let tx;
			try {
				tx = await sdk.zauction.cancelBid(
					bid,
					cancelBidOnChain,
					provider.getSigner(),
				);
			} catch (e) {
				console.error(e);
				throw new Error(constants.ERRORS.SIGNATURE);
			}

			// Transaction request
			try {
				setStatus(constants.MESSAGES.TEXT_CANCELLING_BID);
				await tx?.wait();
				setStatus(undefined);
			} catch (e) {
				console.error(e);
				throw new Error(constants.ERRORS.TRANSACTION);
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
