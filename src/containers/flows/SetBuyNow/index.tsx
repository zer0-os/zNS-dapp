// React Imports
import { useEffect, useRef, useState } from 'react';

// Component Imports
import { Overlay } from 'components';
import SetBuyNow, { Step } from './SetBuyNow';

// Library Imports
import { useWeb3React } from '@web3-react/core';
import useCurrency from 'lib/hooks/useCurrency';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';
import { getMetadata } from 'lib/metadata';

// Type Imports
import { DomainData } from './SetBuyNow';

type SetBuyNowContainerProps = {
	domainId: string;
};

const SetBuyNowContainer = ({ domainId }: SetBuyNowContainerProps) => {
	// Hooks
	const { instance: sdk } = useZnsSdk();
	const { account, library } = useWeb3React();
	const { wildPriceUsd } = useCurrency();

	// State
	const [currentStep, setCurrentStep] = useState<Step>(0);
	const [domainData, setDomainData] = useState<DomainData | undefined>();
	const [isLoadingDomainData, setIsLoadingDomainData] = useState<boolean>(true);
	const isMounted = useRef<boolean>();

	// Stub functions for navigation
	const onNext = () => console.log('next');
	const onCancel = () => console.log('cancel');

	/*
	 * Checks a user's wallet has approved zAuction to
	 * transfer NFTs
	 */
	const checkZAuctionApproval = () => {
		if (!sdk || !library || !account) {
			return;
		}

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
				const zAuction = await sdk.getZAuctionInstanceForDomain(domainId);
				// @todo handle "waiting for wallet approval"
				let tx;
				if (amount) {
					tx = await zAuction.setBuyNowPrice(
						{
							amount: amount?.toString(),
							tokenId: domainId,
						},
						library.getSigner(),
					);
				} else {
					tx = await zAuction.cancelBuyNow(domainId, library.getSigner());
				}
				// @todo handle "wallet rejected"
				// @todo handle "waiting for tx"
				await tx.wait();
				// @todo handle tx failed
			} catch (e) {
				console.error('Failed to set buy now price', e);
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
				// Commented out for faster dev process
				const [domain, events] = await Promise.all([
					sdk.getDomainById(domainId),
					sdk.getDomainEvents(domainId),
				]);
				const metadata = await getMetadata(domain.metadataUri);
				if (isMounted.current !== true) {
					return;
				}
				if (domain && events && metadata) {
					checkZAuctionApproval();
					setDomainData({
						id: domainId,
						title: metadata.title as string,
						domain: domain.name,
						owner: domain.owner,
						assetUrl:
							((metadata.animation_url ||
								metadata.image_full ||
								metadata.image) as string) || '',
						creator: domain.minter,
						highestBid: 0,
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

	// Functions
	const closeOverlay = () => {
		console.log('close');
	};

	return (
		<Overlay open onClose={closeOverlay}>
			<SetBuyNow
				domainData={domainData}
				isLoadingDomainData={isLoadingDomainData}
				step={currentStep}
				onCancel={onCancel}
				onNext={onNext}
				wildPriceUsd={wildPriceUsd}
				approveZAuction={approveZAuction}
				setBuyNowPrice={setBuyNowPrice}
			/>
		</Overlay>
	);
};

export default SetBuyNowContainer;
