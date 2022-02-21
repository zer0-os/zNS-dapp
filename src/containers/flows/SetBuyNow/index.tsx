// React Imports
import { useEffect, useRef, useState } from 'react';

// Component Imports
import SetBuyNow, { Step } from './SetBuyNow';

// Library Imports
import { useWeb3React } from '@web3-react/core';
import useCurrency from 'lib/hooks/useCurrency';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';

// Type Imports
import { DomainData } from './SetBuyNow';
import { ethers } from 'ethers';

export interface SetBuyNowContainerProps {
	domainId: string;
	onCancel: () => void;
}

const SetBuyNowContainer = ({
	domainId,
	onCancel,
}: SetBuyNowContainerProps) => {
	// Hooks
	const { instance: sdk } = useZnsSdk();
	const { account, library } = useWeb3React();
	const { wildPriceUsd } = useCurrency();

	// State
	const [currentStep, setCurrentStep] = useState<Step>(0);
	const [domainData, setDomainData] = useState<DomainData | undefined>();
	const [isLoadingDomainData, setIsLoadingDomainData] = useState<boolean>(true);
	const [error, setError] = useState<string | undefined>();
	const isMounted = useRef<boolean>();

	// Stub functions for navigation
	const onNext = () => console.log('next');

	/*
	 * Checks a user's wallet has approved zAuction to
	 * transfer NFTs
	 */
	const checkZAuctionApproval = () => {
		if (!sdk || !library || !account) {
			return;
		}

		setError(undefined);
		(async () => {
			try {
				const zAuction = await sdk.getZAuctionInstanceForDomain(domainId);
				const isApproved = await zAuction.isZAuctionApprovedToTransferNft(
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
				// @todo handle error
				console.error('Failed to check zAuction approval status', e);
			}
		})();
	};

	/*
	 * Takes the user through the "approve zAuction" flow
	 */
	const approveZAuction = () => {
		if (!sdk || !library || !account) {
			return;
		}
		setError(undefined);
		setCurrentStep(Step.WaitingForWallet);
		(async () => {
			try {
				const zAuction = await sdk.getZAuctionInstanceForDomain(domainId);
				const tx = await zAuction.approveZAuctionTransferNft(
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
				const zAuction = await sdk.getZAuctionInstanceForDomain(domainId);
				let tx;
				if (amount) {
					tx = await zAuction.setBuyNowPrice(
						{
							amount: ethers.utils.parseEther(amount.toString()).toString(),
							tokenId: domainId,
						},
						library.getSigner(),
					);
				} else {
					tx = await zAuction.cancelBuyNow(domainId, library.getSigner());
				}
				setCurrentStep(Step.SettingBuyNow);
				await tx.wait();
				setDomainData({
					...domainData!,
					currentBuyNowPrice: amount
						? ethers.utils.parseEther(amount.toString())
						: undefined,
				});
				setCurrentStep(Step.Success);
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
					(
						await sdk.getZAuctionInstanceForDomain(domainId)
					).getBuyNowPrice(domainId, library.getSigner()),
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
	}, [domainId, library]);

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
