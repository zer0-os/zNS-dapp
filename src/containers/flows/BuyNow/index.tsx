// React Imports
import { useEffect, useRef, useState } from 'react';

// Component Imports
import BuyNow, { Step } from './BuyNow';

// Library Imports
import { useWeb3React } from '@web3-react/core';
import useCurrency from 'lib/hooks/useCurrency';
import useNotification from 'lib/hooks/useNotification';
import { useZnsSdk } from 'lib/hooks/sdk';

// Type Imports
import { Data } from './BuyNow';
import { useZnsContracts } from 'lib/contracts';
import { ERC20 } from 'types';
import { ethers } from 'ethers';
import useMetadata from 'lib/hooks/useMetadata';

// Utils Imports
import { getDisplayErrorMessage } from 'lib/utils/error';

// Constants Imports
import { ERRORS } from 'constants/errors';
import { NOTIFICATIONS } from './BuyNowButton.constants';

export type BuyNowContainerProps = {
	domainId: string;
	onCancel: () => void;
	onSuccess?: () => void;
};

const BuyNowContainer = ({
	domainId,
	onCancel,
	onSuccess,
}: BuyNowContainerProps) => {
	// Hooks
	const { instance: sdk } = useZnsSdk();
	const { getMetadata } = useMetadata();
	const { account, library } = useWeb3React();
	const { wildPriceUsd } = useCurrency();
	const { addNotification } = useNotification();

	const znsContracts = useZnsContracts()!;
	const wildContract: ERC20 = znsContracts.wildToken;

	// State
	const [currentStep, setCurrentStep] = useState<Step>(Step.Details);
	const [data, setData] = useState<Data | undefined>();
	const [isLoadingData, setIsLoadingDomainData] = useState<boolean>(true);
	const [error, setError] = useState<string | undefined>();
	const isMounted = useRef<boolean>();

	// Stub functions for navigation
	const onNext = () => {
		switch (currentStep) {
			case Step.Details:
				buy();
				break;
			case Step.ApproveZAuction:
				approveZAuction();
				break;
			case Step.FailedToCheckZAuction:
				setCurrentStep(Step.ApproveZAuction);
				setError('');
				break;
		}
	};

	const approveZAuction = async () => {
		let approvalTx;
		setError(undefined);
		try {
			if (!sdk || !sdk.zauction) {
				throw Error(ERRORS.FAILED_TO_CHECK_ZAUCTION);
			}

			try {
				setCurrentStep(Step.ApproveZAuctionWaiting);
				approvalTx = await sdk.zauction.approveZAuctionToSpendTokens(
					domainId,
					library.getSigner(),
				);
				setCurrentStep(Step.ApproveZAuctionProcessing);
			} catch (e: any) {
				throw Error(getDisplayErrorMessage(e.message));
			}

			try {
				await approvalTx.wait();
				setCurrentStep(Step.Details);
			} catch {
				throw Error(ERRORS.TRANSACTION);
			}

			getData();
		} catch (e: any) {
			setError(e.message);
			setCurrentStep(Step.FailedToCheckZAuction);
		}
	};

	const buy = async () => {
		setError(undefined);
		setCurrentStep(Step.WaitingForWalletConfirmation);
		try {
			if (!sdk || !sdk.zauction) {
				throw Error(ERRORS.FAILED_TO_CHECK_ZAUCTION);
			}
			const tx = await sdk.zauction.buyNow(
				{ amount: data!.buyNowPrice.toString(), tokenId: domainId },
				library.getSigner(),
			);
			try {
				setCurrentStep(Step.Buying);
				await tx.wait();
			} catch (e) {
				setCurrentStep(Step.Details);
				throw Error(ERRORS.TRANSACTION);
			}
			addNotification(`${NOTIFICATIONS.BUY_NOW_SUCCESSFUL} ${data?.title}`);
			setCurrentStep(Step.Success);
			if (onSuccess) {
				onSuccess();
			}
		} catch (e: any) {
			console.error(e);
			setError(getDisplayErrorMessage(e.message));
			setCurrentStep(Step.Details);
		}
	};

	const getData = async () => {
		if (!library || !account) {
			return;
		}
		// Reset some state in case dependency changes
		setError(undefined);
		setIsLoadingDomainData(true);
		let buyNowPrice;
		if (!sdk || !sdk.zauction) {
			throw Error(ERRORS.FAILED_TO_CHECK_ZAUCTION);
		}
		try {
			// Get buy now price
			const price = await sdk.zauction.getBuyNowPrice(domainId);
			buyNowPrice = ethers.utils.parseEther(price);

			// Check zAuction approved amount is larger than buy now price
			const isApproved = await sdk.zauction.needsToApproveZAuctionToSpendTokens(
				domainId,
				account,
				buyNowPrice,
			);
			// Timeout to prevent jolt
			await new Promise((r) => setTimeout(r, 1500));
			if (!isApproved) {
				setCurrentStep(Step.ApproveZAuction);
				return;
			}
		} catch (e) {
			console.warn(ERRORS.FAILED_TO_GET_DATA, e);
			setCurrentStep(Step.FailedToCheckZAuction);
		}
		try {
			const [domain, balance] = await Promise.all([
				sdk.getDomainById(domainId),
				wildContract.balanceOf(account),
			]);
			const metadata = await getMetadata(domain.metadataUri);
			if (domain && metadata && buyNowPrice && balance) {
				setData({
					id: domainId,
					title: (metadata.title || metadata.name) as string,
					domain: domain.name,
					owner: domain.owner,
					assetUrl:
						((metadata.animation_url ||
							metadata.image_full ||
							metadata.image) as string) || '',
					creator: domain.minter,
					highestBid: 0,
					buyNowPrice: buyNowPrice,
					balanceWild: balance,
					userWalletAddress: account,
				});
			}
		} catch {
			console.error(ERRORS.FAILED_TO_LOAD_DOMAIN_ID, domainId);
		}
		setIsLoadingDomainData(false);
	};

	/*
	 * Loads domain data
	 */
	useEffect(() => {
		isMounted.current = true;
		getData();
		return () => {
			isMounted.current = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [account, domainId, library]);

	return (
		<BuyNow
			data={data}
			error={error}
			isLoadingData={isLoadingData}
			onCancel={onCancel}
			onNext={onNext}
			step={currentStep}
			wildPriceUsd={wildPriceUsd}
		/>
	);
};

export default BuyNowContainer;
