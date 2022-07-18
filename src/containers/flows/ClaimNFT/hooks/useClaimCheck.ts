//- React Imports
import { useState, useCallback, useEffect, useRef } from 'react';

//- Library Imports
import { useZSaleSdk } from 'lib/hooks/sdk';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { defaultNetworkId } from 'lib/network';
import { useZnsDomain } from 'lib/hooks/useZnsDomain';

//- Utils Imports
import {
	handleInputNotification,
	NotificationType,
} from '../components/WizardSteps/Details/Details.utils';

//- Constants Imports
import { MESSAGES } from '../ClaimNFT.constants';

interface UseClaimCheckReturn {
	isCheckDataLoading: boolean;
	isTokenClaimable?: boolean;
	isValidSubdomain?: boolean;
	setIsTokenClaimable: (state?: boolean) => void;
	setIsValidSubdomain: (state?: boolean) => void;
}

const useClaimCheck = (
	tokenID: string,
	requestCheck: boolean,
	setInputNotification?: (text: string) => void,
	setNotificationType?: (type: NotificationType) => void,
): UseClaimCheckReturn => {
	const isMounted = useRef<boolean>();
	const { claimInstance: sdk } = useZSaleSdk();
	const { chainId } = useWeb3React<Web3Provider>(); // get provider for connected wallet
	const znsDomain = useZnsDomain(tokenID, chainId || defaultNetworkId);
	const domainName = znsDomain.domain?.name;
	const [isCheckDataLoading, setIsCheckDataLoading] = useState<boolean>(false);
	const [isTokenClaimable, setIsTokenClaimable] = useState<boolean>();
	const [isValidSubdomain, setIsValidSubdomain] = useState<boolean>();

	const checkDomain = useCallback(async () => {
		if (!tokenID) {
			return;
		}
		setIsTokenClaimable(undefined);
		setIsCheckDataLoading(true);

		try {
			const isClaimable = await sdk.canBeClaimed(tokenID);
			setIsTokenClaimable(isClaimable);
		} catch (e) {
			console.error(MESSAGES.ASSET_ERROR, e);
		} finally {
			setIsCheckDataLoading(false);
		}
	}, [sdk, tokenID]);

	useEffect(() => {
		if (tokenID !== '' && requestCheck) {
			// REPLACE URL - LABELS.WILDER_WHEELS_ZNA
			if (domainName?.includes('wilder.candy.wolfsale')) {
				setIsValidSubdomain(true);
			}
			checkDomain();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [tokenID, requestCheck, domainName]);

	useEffect(() => {
		if (
			tokenID !== '' &&
			requestCheck &&
			setInputNotification &&
			setNotificationType
		) {
			handleInputNotification(
				setInputNotification,
				setNotificationType,
				isTokenClaimable,
				isValidSubdomain,
			);
		}
	}, [
		isTokenClaimable,
		isValidSubdomain,
		requestCheck,
		setInputNotification,
		setNotificationType,
		tokenID,
	]);

	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	return {
		isCheckDataLoading,
		isTokenClaimable,
		isValidSubdomain,
		setIsTokenClaimable,
		setIsValidSubdomain,
	};
};

export default useClaimCheck;
