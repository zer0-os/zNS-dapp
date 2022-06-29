// React Imports
import { useEffect, useRef, useState } from 'react';

// Component Imports
import SetBuyNow, { Step } from './SetBuyNow';

// Library Imports
import { useWeb3React } from '@web3-react/core';
import useCurrency from 'lib/hooks/useCurrency';
import useNotification from 'lib/hooks/useNotification';
import { useZnsSdk } from 'lib/hooks/sdk';

// Type Imports
import { DomainData } from './SetBuyNow';
import { ethers } from 'ethers';
import useMetadata from 'lib/hooks/useMetadata';

//- Utils Imports
import { getErrorMessage } from 'lib/utils/error';

// Constants Imports
import { ERRORS } from 'constants/errors';
import { NOTIFICATIONS } from './SetBuyNow.constants';
import { CURRENCY } from 'constants/currency';

export interface SetBuyNowContainerProps {
	domainId: string;
	onCancel: () => void;
	onSuccess?: () => void;
}

const SetBuyNowContainer = ({
	domainId,
	onCancel,
	onSuccess,
}: SetBuyNowContainerProps) => {
	// Hooks
	const { instance: sdk } = useZnsSdk();
	const { account, library } = useWeb3React();
	const { wildPriceUsd } = useCurrency();
	const { addNotification } = useNotification();
	const { getMetadata } = useMetadata();

	// State
	const [currentStep, setCurrentStep] = useState<Step>(0);
	const [domainData, setDomainData] = useState<DomainData | undefined>();
	const [isLoadingDomainData, setIsLoadingDomainData] = useState<boolean>(true);
	const [error, setError] = useState<string | undefined>();
	const isMounted = useRef<boolean>();
	/*
	 * Checks a user's wallet has approved zAuction to
	 * transfer NFTs
	 */
	const checkZAuctionApproval = () => {
		if (!sdk || !sdk.zauction || !library || !account) {
			return;
		}

		setError(undefined);
		(async () => {
			try {
				const isApproved =
					await sdk.zauction.needsToApproveZAuctionToTransferNfts(
						domainId,
						account,
					);
				// Wait for a sec so the UI doesn't look broken if the above
				// checks resolve quickly
				await new Promise((r) => setTimeout(r, 1500));
				if (isApproved) {
					setCurrentStep(Step.SetBuyNow);
				} else {
					setCurrentStep(Step.ApproveZAuction);
				}
			} catch (e) {
				console.error(ERRORS.CONSOLE_TEXT, e);
				setCurrentStep(Step.FailedToCheckZAuction);
			}
		})();
	};

	/*
	 * Takes the user through the "approve zAuction" flow
	 */
	const approveZAuction = () => {
		if (!sdk || !sdk.zauction || !library || !account) {
			return;
		}
		setError(undefined);
		setCurrentStep(Step.WaitingForWallet);
		(async () => {
			try {
				const tx = await sdk.zauction.approveZAuctionToTransferNfts(
					domainId,
					library.getSigner(),
				);
				try {
					setCurrentStep(Step.ApprovingZAuction);
					await tx.wait();
				} catch (e) {
					setCurrentStep(Step.ApproveZAuction);
					setError(ERRORS.TRANSACTION);
				}
				setCurrentStep(Step.SetBuyNow);
			} catch (e) {
				setCurrentStep(Step.ApproveZAuction);
				const errorText = getErrorMessage(e);
				setError(errorText);
				console.error(e);
			}
		})();
	};

	/*
	 * Called at the end of the flow
	 * Makes final contract call to set buy now price
	 */
	const setBuyNowPrice = (amount?: number) => {
		(async () => {
			// Handle signature request
			try {
				setError(undefined);
				setCurrentStep(Step.WaitingForBuyNowConfirmation);
				let tx;

				if (amount) {
					tx = await sdk.zauction.setBuyNowPrice(
						{
							amount: ethers.utils.parseEther(amount.toString()).toString(),
							tokenId: domainId,
						},
						library.getSigner(),
					);
				} else {
					tx = await sdk.zauction.cancelBuyNow(domainId, library.getSigner());
				}

				// Handle transaction request
				try {
					setCurrentStep(Step.SettingBuyNow);
					await tx?.wait();
					// Timeout to prevent jolt
					if (!amount) {
						await new Promise((r) => setTimeout(r, 500));
					}
				} catch (e) {
					setCurrentStep(Step.SetBuyNow);
					setError(ERRORS.TRANSACTION);
				}

				setDomainData({
					...domainData!,
					currentBuyNowPrice: amount
						? ethers.utils.parseEther(amount.toString())
						: undefined,
				});
				if (amount) {
					addNotification(
						`${NOTIFICATIONS.SET_BUY_NOW_SUCCESSFUL} ${amount} ${CURRENCY.WILD}`,
					);
				} else {
					addNotification(NOTIFICATIONS.REMOVE_BUY_NOW_SUCCESSFUL);
				}

				setCurrentStep(Step.Success);
				if (onSuccess) {
					onSuccess();
				}
			} catch (e) {
				setCurrentStep(Step.SetBuyNow);
				console.error(e);
				const errorText = getErrorMessage(e);
				setError(errorText);
			}
		})();
	};

	/*
	 * Loads domain data
	 */
	useEffect(() => {
		isMounted.current = true;
		if (!library) {
			return;
		}
		(async () => {
			setIsLoadingDomainData(true);
			try {
				const [domain, events, price] = await Promise.all([
					sdk.getDomainById(domainId),
					sdk.getDomainEvents(domainId),
					sdk.zauction.getBuyNowPrice(domainId),
				]);
				const metadata = await getMetadata(domain.metadataUri);
				if (domain && events && metadata) {
					const buyNow = ethers.utils.parseEther(price);
					checkZAuctionApproval();
					setDomainData({
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
						currentBuyNowPrice: buyNow,
					});
				}
				setIsLoadingDomainData(false);
			} catch {
				console.error('<SetBuyNow> Failed to load domain ID', domainId);
				setIsLoadingDomainData(false);
			}
		})();
		return () => {
			isMounted.current = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [domainId, library, sdk]);

	return (
		<SetBuyNow
			error={error}
			domainData={domainData}
			isLoadingDomainData={isLoadingDomainData}
			step={currentStep}
			onCancel={onCancel}
			wildPriceUsd={wildPriceUsd}
			approveZAuction={approveZAuction}
			setBuyNowPrice={setBuyNowPrice}
			account={account ?? ''}
		/>
	);
};

export default SetBuyNowContainer;
