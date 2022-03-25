/*
 * This hook could be changed into a helper, as
 * it doesn't require internal state
 */

import { useWeb3React } from '@web3-react/core';
import { Bid } from '@zero-tech/zauction-sdk';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';
import { useState } from 'react';
import constants from '../CancelBid.constants';

export type UseCancelBidReturn = {
	cancel: (bid: Bid) => Promise<void>;
	status?: string;
};

const useCancelBid = (): UseCancelBidReturn => {
	const { library } = useWeb3React();
	const { instance: sdk } = useZnsSdk();

	const [status, setStatus] = useState<string | undefined>();

	const cancel = async (bid: Bid) => {
		if (!library) {
			console.error('Could not find web3 library');
			throw new Error(constants.ERRORS.LIBRARY);
		}

		try {
			// Signature request
			setStatus(constants.MESSAGES.TEXT_WAITING_FOR_WALLET);
			let tx;
			try {
				tx = await sdk.zauction.cancelBid(
					bid.bidNonce,
					bid.signedMessage,
					bid.tokenId,
					true,
					library.getSigner(),
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
