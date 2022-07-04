// React Imports
import { useEffect, useRef, useState } from 'react';

// Component Imports
import SetBuyNow, { Step } from './SetBuyNow';

// Library Imports
import { useWeb3React } from '@web3-react/core';
import useNotification from 'lib/hooks/useNotification';
import { useZnsSdk } from 'lib/hooks/sdk';

// Type Imports
import { DomainData } from './SetBuyNow';
import { ethers } from 'ethers';
import useMetadata from 'lib/hooks/useMetadata';
import { BuyNowParams } from '@zero-tech/zns-sdk/lib/zAuction';
import { ConvertedTokenInfo } from '@zero-tech/zns-sdk';

export interface SetBuyNowContainerProps {
	domainId: string;
	onCancel: () => void;
	onSuccess?: () => void;
	paymentTokenInfo: ConvertedTokenInfo;
}

const SetBuyNowContainer = ({
	domainId,
	onCancel,
	onSuccess,
	paymentTokenInfo,
}: SetBuyNowContainerProps) => {
	// Hooks
	const { instance: sdk } = useZnsSdk();
	const { account, library } = useWeb3React();
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
				const needsApproval =
					await sdk.zauction.needsToApproveZAuctionToTransferNftsByDomain(
						domainId,
						account,
					);
				// Wait for a sec so the UI doesn't look broken if the above
				// checks resolve quickly
				await new Promise((r) => setTimeout(r, 1500));
				if (needsApproval) {
					setCurrentStep(Step.ApproveZAuction);
				} else {
					setCurrentStep(Step.SetBuyNow);
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
		if (!sdk || !sdk.zauction || !library || !account) {
			return;
		}
		setError(undefined);
		setCurrentStep(Step.WaitingForWallet);
		(async () => {
			try {
				const tx = await sdk.zauction.approveZAuctionToTransferNftsByDomain(
					domainId,
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
					console.log('setting buy now', amount);
					tx = await sdk.zauction.setBuyNowPrice(
						{
							amount: ethers.utils.parseEther(amount.toString()).toString(),
							tokenId: domainId,
						} as BuyNowParams,
						library.getSigner(),
					);
				} else {
					console.log('cancelling buy now');
					tx = await sdk.zauction.cancelBuyNow(domainId, library.getSigner());
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
						`You have successfully set a Buy Now price of ${amount} ${paymentTokenInfo.name}`,
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
			} catch (error) {
				console.error('<SetBuyNow> Failed to load domain ID', domainId, error);
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
			paymentTokenInfo={paymentTokenInfo}
			approveZAuction={approveZAuction}
			setBuyNowPrice={setBuyNowPrice}
			account={account ?? ''}
		/>
	);
};

export default SetBuyNowContainer;
