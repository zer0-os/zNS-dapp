// React Imports
import { useEffect, useRef, useState } from 'react';

// Component Imports
import SetBuyNow, { Step } from './SetBuyNow';

// Library Imports
import { useWeb3React } from '@web3-react/core';
import useCurrency from 'lib/hooks/useCurrency';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';
import useNotification from 'lib/hooks/useNotification';

// Type Imports
import { DomainData } from './SetBuyNow';
import { ethers } from 'ethers';
import { useZAuctionSdk } from 'lib/providers/ZAuctionSdkProvider';

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
	const { instance: zAuctionInstance } = useZAuctionSdk();
	const { account, library } = useWeb3React();
	const { wildPriceUsd } = useCurrency();
	const { addNotification } = useNotification();

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
		if (!zAuctionInstance || !library || !account) {
			return;
		}

		setError(undefined);
		(async () => {
			try {
				const isApproved =
					await zAuctionInstance.isZAuctionApprovedToTransferNft(account);
				// Wait for a sec so the UI doesn't look broken if the above
				// checks resolve quickly
				await new Promise((r) => setTimeout(r, 1500));
				if (isApproved) {
					setCurrentStep(Step.SetBuyNow);
				} else {
					setCurrentStep(Step.ApproveZAuction);
				}
			} catch (e) {
				// @todo handle error
				console.error('Failed to check zAuction approval status', e);
			}
		})();
	};

	/*
	 * Takes the user through the "approve zAuction" flow
	 */
	const approveZAuction = () => {
		if (!zAuctionInstance || !library || !account) {
			return;
		}
		setError(undefined);
		setCurrentStep(Step.WaitingForWallet);
		(async () => {
			try {
				const tx = await zAuctionInstance.approveZAuctionTransferNft(
					library.getSigner(),
				);
				// @todo handle wallet rejected
				setCurrentStep(Step.ApprovingZAuction);
				await tx.wait();
				// @todo handle tx failed
				setCurrentStep(Step.SetBuyNow);
			} catch (e) {
				// @todo handle errors more specifically
				setCurrentStep(Step.ApproveZAuction);
				console.error('Approved', e);
			}
		})();
	};

	/*
	 * Called at the end of the flow
	 * Makes final contract call to set buy now price
	 */
	const setBuyNowPrice = (amount?: number) => {
		(async () => {
			try {
				setError(undefined);
				setCurrentStep(Step.WaitingForBuyNowConfirmation);
				let tx;
				if (amount) {
					tx = await zAuctionInstance.setBuyNowPrice(
						{
							amount: ethers.utils.parseEther(amount.toString()).toString(),
							tokenId: domainId,
						},
						library.getSigner(),
					);
				} else {
					tx = await zAuctionInstance.cancelBuyNow(
						domainId,
						library.getSigner(),
					);
				}
				setCurrentStep(Step.SettingBuyNow);
				await tx.wait();
				setDomainData({
					...domainData!,
					currentBuyNowPrice: amount
						? ethers.utils.parseEther(amount.toString())
						: undefined,
				});
				if (amount) {
					addNotification(
						`You have successfully set a Buy Now price of ${amount} WILD`,
					);
				} else {
					addNotification(`You have successfully removed the Buy Now price`);
				}

				setCurrentStep(Step.Success);
				if (onSuccess) {
					onSuccess();
				}
			} catch (e) {
				setCurrentStep(Step.SetBuyNow);
				setError((e as any).message);
				console.log('Error setting buy now price', e);
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
				const [domain, events, metadata, listing] = await Promise.all([
					sdk.getDomainById(domainId),
					sdk.getDomainEvents(domainId),
					sdk.getDomainMetadata(domainId, library.getSigner()),
					zAuctionInstance.getBuyNowPrice(domainId),
				]);
				if (domain && events && metadata) {
					const buyNow = listing.price;
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
	}, [domainId, library, zAuctionInstance]);

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
		/>
	);
};

export default SetBuyNowContainer;
