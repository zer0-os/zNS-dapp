//- React Imports
import { useState, useEffect, useCallback } from 'react';

//- Library Imports
import { useZSaleSdk } from 'lib/hooks/sdk';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { defaultNetworkId } from 'lib/network';
import { useZnsDomain } from 'lib/hooks/useZnsDomain';

//- Constants Imports
import { MESSAGES } from '../ClaimNFT.constants';

interface UseClaimCheckReturn {
	isCheckDataLoading: boolean;
	isTokenClaimable: boolean;
	isValidSubdomain: boolean;
}

const useClaimCheck = (
	tokenID: string,
	requestCheck: boolean,
): UseClaimCheckReturn => {
	const { claimInstance: sdk } = useZSaleSdk();
	const { chainId } = useWeb3React<Web3Provider>(); // get provider for connected wallet
	const znsDomain = useZnsDomain(tokenID, chainId || defaultNetworkId);
	const domainName = znsDomain.domain?.name;
	const [isCheckDataLoading, setIsCheckDataLoading] = useState<boolean>(true);
	const [isTokenClaimable, setIsTokenClaimable] = useState<boolean>(false);
	const [isValidSubdomain, setIsValidSubdomain] = useState<boolean>(false);

	const preventCheck = () => {
		setIsTokenClaimable(false);
		setIsCheckDataLoading(false);
	};

	const checkDomain = useCallback(async () => {
		if (!tokenID) {
			return;
		}

		setIsCheckDataLoading(true);

		try {
			const isClaimable = await sdk.canBeClaimed(tokenID);
			console.log(isClaimable, 'isClaimable');
			setIsTokenClaimable(isClaimable);
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
			if (domainName?.includes('wilder.candy.wolfsale')) {
				setIsValidSubdomain(true);
			}
			checkDomain();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tokenID, requestCheck, domainName]);

	console.log(isTokenClaimable, 'isTokenClaimable');
	console.log(isValidSubdomain, 'isValidSubdomain');
	console.log('domainName', domainName?.includes('wilder.candy.wolfsale'));

	return {
		isCheckDataLoading,
		isTokenClaimable,
		isValidSubdomain,
	};
};

export default useClaimCheck;
