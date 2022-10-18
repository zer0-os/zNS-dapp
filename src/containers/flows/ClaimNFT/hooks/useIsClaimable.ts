import { useZnsSdk, useZSaleSdk } from 'lib/hooks/sdk';
import { useState } from 'react';
import { BigNumber } from 'ethers';
import { TEXT_INPUT } from '../components/WizardSteps/Details/Details.constants';

export enum Status {
	DEFAULT,
	ERROR,
	SUCCESS,
	LOADING,
}

const useIsClaimable = () => {
	const { instance: znsSdk } = useZnsSdk();
	const { claimInstance: zSaleSdk } = useZSaleSdk();

	const [helperText, setHelperText] = useState<string | undefined>();
	const [status, setStatus] = useState<Status>(Status.DEFAULT);
	const [isTokenClaimable, setIsTokenClaimable] = useState<
		boolean | undefined
	>();

	const checkClaimable = async (text: string) => {
		resetState();
		setStatus(Status.LOADING);
		try {
			let token, domain, isClaimable;

			if (/Qm(\w{44})[/\w]*/.test(text)) {
				console.log('is metadata URI');
				throw Error(
					'You have entered an IPFS hash - please enter a valid token ID',
				);
			}

			try {
				token = BigNumber.from(text).toHexString();
			} catch (e) {
				console.error(e);
				throw Error('Invalid token ID');
			}

			try {
				domain = await znsSdk.getDomainById(token, false);
				if (!domain || !domain.name) {
					// eslint-disable-next-line no-throw-literal
					throw undefined;
				}
			} catch (e) {
				throw Error('Invalid token ID');
			}

			if (!domain.name.includes('wilder.wheels.genesis')) {
				throw Error(TEXT_INPUT.INVALID_SUBDOMAIN);
			}

			try {
				isClaimable = await zSaleSdk.canBeClaimed(token);
			} catch (e) {
				console.error('Failed to check is claimable ', token);
				throw Error('Failed to check token ID');
			}
			if (isClaimable) {
				setIsTokenClaimable(true);
				setHelperText(TEXT_INPUT.CLAIM_CONSUMED_SUCCESS);
				setStatus(Status.SUCCESS);
			} else {
				setIsTokenClaimable(false);
				throw Error(TEXT_INPUT.CLAIM_CONSUMED_ERROR);
			}
		} catch (e) {
			setStatus(Status.ERROR);
			setHelperText(e.message);
		}
	};

	const resetState = () => {
		setStatus(Status.DEFAULT);
		setHelperText(undefined);
		setIsTokenClaimable(undefined);
	};

	return {
		checkClaimable,
		helperText,
		status,
		resetState,
		isTokenClaimable,
	};
};

export default useIsClaimable;
