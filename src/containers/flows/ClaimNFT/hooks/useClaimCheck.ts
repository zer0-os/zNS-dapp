//- React Imports
import { useState, useEffect, useCallback } from 'react';

//- Library Imports
import { useZnsSdk } from 'lib/hooks/sdk';

//- Constants Imports
import { MESSAGES } from '../ClaimNFT.constants';

interface UseClaimCheckReturn {
	isCheckDataLoading: boolean | undefined;
	isTokenClaimed: boolean | undefined;
}

const useClaimCheck = (
	tokenID: string,
	requestCheck: boolean,
): UseClaimCheckReturn => {
	const { instance: sdk } = useZnsSdk();
	const [isCheckDataLoading, setIsCheckDataLoading] = useState<boolean>(true);
	const [isTokenClaimed, setIsTokenClaimed] = useState<boolean | undefined>();

	const preventCheck = () => {
		setIsTokenClaimed(undefined);
		setIsCheckDataLoading(false);
	};

	const checkDomain = useCallback(async () => {
		if (!tokenID) {
			return;
		}
		setIsCheckDataLoading(true);

		try {
			// REPLACE WITH SDK METHOD
			// const [checkData] = await Promise.all([sdk.canBeClaimed(tokenID)]);
			const checkData = false;

			setIsTokenClaimed(checkData);
		} catch (e) {
			console.error(MESSAGES.ASSET_ERROR, e);
		} finally {
			setIsCheckDataLoading(false);
		}
	}, [sdk, tokenID]);

	useEffect(() => {
		if (!tokenID || !requestCheck) {
			preventCheck();
		} else if (tokenID && requestCheck) {
			checkDomain();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tokenID, requestCheck]);

	return {
		isCheckDataLoading,
		isTokenClaimed,
	};
};

export default useClaimCheck;
