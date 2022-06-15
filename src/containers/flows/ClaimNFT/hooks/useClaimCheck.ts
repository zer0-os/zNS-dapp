import { useZSaleSdk } from 'lib/hooks/sdk';
//- React Imports
import { useState, useEffect, useCallback } from 'react';

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
	const { claimInstance: sdk } = useZSaleSdk();
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
			const isClaimable = await sdk.canBeClaimed(tokenID);
			setIsTokenClaimed(isClaimable);
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
