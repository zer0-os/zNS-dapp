/*
 * This hook could be changed into a helper, as
 * it doesn't require internal state
 */

import { useWeb3React } from '@web3-react/core';
import { Bid } from '@zero-tech/zauction-sdk';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';
import { useState } from 'react';
import constants from '../AcceptBid.constants';

export type UseAcceptBidReturn = {
	accept: (bid: Bid) => Promise<void>;
	status?: string;
};

const useAcceptBid = (): UseAcceptBidReturn => {
	const { library } = useWeb3React();
	const { instance: sdk } = useZnsSdk();

	const [status, setStatus] = useState<string | undefined>();

	const accept = async (bid: Bid) => {
		if (!library) {
			console.error('Could not find web3 library');
			throw new Error(constants.ERRORS.LIBRARY);
		}

		try {
			// Signature request
			setStatus(constants.MESSAGES.TEXT_WAITING_FOR_WALLET);
			let tx;
			try {
				tx = await sdk.zauction.acceptBid(bid, library.getSigner());
			} catch (err) {
				console.error(err);
				throw new Error(constants.ERRORS.SIGNATURE);
			}

			// Transaction request
			try {
				setStatus(constants.MESSAGES.TEXT_ACCEPTING_BID);
				await tx?.wait();
				setStatus(undefined);
			} catch (err) {
				console.error(err);
				throw new Error(constants.ERRORS.TRANSACTION);
			}
		} catch (err) {
			setStatus(undefined);
			throw err;
		}
	};

	return {
		accept,
		status,
	};
};

export default useAcceptBid;
