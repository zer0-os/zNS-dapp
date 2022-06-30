/*
 * This hook could be changed into a helper, as
 * it doesn't require internal state
 */

//- React Imports
import { useState } from 'react';

//- Library Imports
import { useWeb3React } from '@web3-react/core';
import { Bid } from '@zero-tech/zauction-sdk';

//- Utils Imports
import { useZnsSdk } from 'lib/hooks/sdk';

//- Constants Imports
import { MESSAGES } from '../AcceptBid.constants';
import { ERRORS } from 'constants/errors';
import { getDisplayErrorMessage } from 'lib/utils/error';

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
			console.error(ERRORS.LIBRARY_NOT_FOUND);
			throw new Error(ERRORS.LIBRARY);
		}

		try {
			// Signature request
			setStatus(MESSAGES.TEXT_WAITING_FOR_WALLET);
			let tx;
			try {
				tx = await sdk.zauction.acceptBid(bid, library.getSigner());
			} catch (err: any) {
				console.error(err);
				const errorText = getDisplayErrorMessage(err.message);
				throw new Error(errorText);
			}

			// Transaction request
			try {
				setStatus(MESSAGES.TEXT_ACCEPTING_BID);
				await tx?.wait();
				setStatus(undefined);
			} catch (err) {
				console.error(err);
				throw new Error(ERRORS.TRANSACTION);
			}
		} catch (e) {
			setStatus(undefined);
			throw e;
		}
	};

	return {
		accept,
		status,
	};
};

export default useAcceptBid;
