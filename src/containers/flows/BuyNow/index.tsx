// React Imports
import { useEffect, useRef, useState } from 'react';

// Component Imports
import BuyNow, { Step } from './BuyNow';

// Library Imports
import { useWeb3React } from '@web3-react/core';
import useCurrency from 'lib/hooks/useCurrency';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';

// Type Imports
import { Data } from './BuyNow';
import { useZnsContracts } from 'lib/contracts';
import { ERC20 } from 'types';

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
	const { account, library } = useWeb3React();
	const { wildPriceUsd } = useCurrency();

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
		}
	};

	const approveZAuction = async () => {
		let zAuction, approvalTx;
		setError(undefined);
		try {
			try {
				zAuction = await sdk.getZAuctionInstanceForDomain(domainId);
			} catch (e) {
				throw Error('Failed to retrieve zAuction instance');
			}

			try {
				setCurrentStep(Step.ApproveZAuctionWaiting);
				approvalTx = await zAuction.approveZAuctionSpendTradeTokens(
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
		} catch (e) {
			setError(e.message);
			setCurrentStep(Step.ApproveZAuction);
		}
	};

	const buy = async () => {
		setError(undefined);
		setCurrentStep(Step.WaitingForWalletConfirmation);
		try {
			const zAuction = await sdk.getZAuctionInstanceForDomain(domainId);
			const tx = await zAuction.buyNow(
				{ amount: data!.buyNowPrice.toString(), tokenId: domainId },
				library.getSigner(),
			);
			setCurrentStep(Step.Buying);
			await tx.wait();
			setCurrentStep(Step.Success);
			if (onSuccess) {
				onSuccess();
			}
		} catch (e) {
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

		// Get buy now price
		const zAuction = await sdk.getZAuctionInstanceForDomain(domainId);
		const listing = await zAuction.getBuyNowPrice(domainId);
		const buyNowPrice = listing.price;

		// Check zAuction approved amount is larger than buy now price
		const allowance = await zAuction.getZAuctionSpendAllowance(account);
		const isApproved = allowance.gte(buyNowPrice);
		if (!isApproved) {
			setCurrentStep(Step.ApproveZAuction);
			return;
		}
		try {
			const [domain, metadata, balance] = await Promise.all([
				sdk.getDomainById(domainId),
				sdk.getDomainMetadata(domainId, library.getSigner()),
				wildContract.balanceOf(account),
			]);
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
			wildPriceUsd={wildPriceUsd}
		/>
	);
};

export default BuyNowContainer;
