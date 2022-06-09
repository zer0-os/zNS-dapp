// React Imports
import { useEffect, useRef, useState } from 'react';

// Component Imports
import BuyNow, { Step } from './BuyNow';

// Library Imports
import { useWeb3React } from '@web3-react/core';
import useNotification from 'lib/hooks/useNotification';
import { useZnsSdk } from 'lib/hooks/sdk';

// Type Imports
import { Data } from './BuyNow';
import { ethers } from 'ethers';
import useMetadata from 'lib/hooks/useMetadata';
import { BuyNowParams } from '@zero-tech/zauction-sdk';
import { PaymentTokenInfo } from 'lib/types';

export type BuyNowContainerProps = {
	domainId: string;
	onCancel: () => void;
	onSuccess?: () => void;
	paymentTokenInfo: PaymentTokenInfo;
};

const BuyNowContainer = ({
	domainId,
	onCancel,
	onSuccess,
	paymentTokenInfo,
}: BuyNowContainerProps) => {
	// Hooks
	const { instance: sdk } = useZnsSdk();
	const { getMetadata } = useMetadata();
	const { account, library } = useWeb3React();
	const { addNotification } = useNotification();

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
		}
	};

	const approveZAuction = async () => {
		let approvalTx;
		setError(undefined);
		try {
			if (!sdk || !sdk.zauction) {
				throw Error('Failed to retrieve zAuction instance');
			}

			try {
				setCurrentStep(Step.ApproveZAuctionWaiting);
				approvalTx = await sdk.zauction.approveZAuctionToSpendTokensByDomain(
					domainId,
					library.getSigner(),
				);
				setCurrentStep(Step.ApproveZAuctionProcessing);
			} catch (e) {
				throw Error('Transaction rejected by wallet');
			}

			try {
				await approvalTx.wait();
				setCurrentStep(Step.Details);
			} catch {
				throw Error('Transaction failed - please try again');
			}

			getData();
		} catch (e: any) {
			setError(e.message);
			setCurrentStep(Step.ApproveZAuction);
		}
	};

	const buy = async () => {
		setError(undefined);
		setCurrentStep(Step.WaitingForWalletConfirmation);
		try {
			if (!sdk || !sdk.zauction) {
				throw Error('Failed to retrieve zAuction instance');
			}
			const tx = await sdk.zauction.buyNow(
				{
					amount: data!.buyNowPrice.toString(),
					tokenId: domainId,
				} as BuyNowParams,
				library.getSigner(),
			);
			setCurrentStep(Step.Buying);
			await tx.wait();
			addNotification(`You have successfully purchased ${data?.title}`);
			setCurrentStep(Step.Success);
			if (onSuccess) {
				onSuccess();
			}
		} catch (e: any) {
			console.log(e);
			setError(e.message);
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
			throw Error('Failed to retrieve zAuction instance');
		}
		try {
			// Get buy now price
			const price = await sdk.zauction.getBuyNowPrice(domainId);
			buyNowPrice = ethers.utils.parseEther(price);

			// Check zAuction approved amount is larger than buy now price
			const needsApproval =
				await sdk.zauction.needsToApproveZAuctionToSpendTokensByDomain(
					domainId,
					account,
					buyNowPrice,
				);
			if (needsApproval) {
				setCurrentStep(Step.ApproveZAuction);
				return;
			}
		} catch (e) {
			console.warn('<BuyNow> Failed to Get Data', e);
		}
		try {
			const [domain, balance] = await Promise.all([
				sdk.getDomainById(domainId),
				sdk.zauction.getUserBalanceForPaymentToken(
					account,
					paymentTokenInfo.id,
				),
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
			console.error('<BuyNow> Failed to load domain ID', domainId);
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
			paymentTokenInfo={paymentTokenInfo}
		/>
	);
};

export default BuyNowContainer;
