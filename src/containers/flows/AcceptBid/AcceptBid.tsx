//- React Imports
import { useEffect, useRef, useState } from 'react';

//- Global Component Imports
import { Overlay, Wizard } from 'components';

//- Components Imports
import Details from './components/Details/Details';
import Success from './components/Success/Success';

//- Library Imports
import useAcceptBid from './hooks/useAcceptBid';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useWeb3React } from '@web3-react/core';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';

//- Types Imports
import { Step } from './AcceptBid.types';

//- Constants Imports
import {
	BUTTONS,
	ERRORS,
	MESSAGES,
	STATUS_TEXT,
	TITLES,
} from './AcceptBid.constants';

// TODO set any types
type AcceptBidProps = {
	bid: any;
	bidData: any;
	refetch: any;
	isLoading: any;
	assetUrl: string;
	creatorId: string;
	domainName: string;
	domainId: string;
	walletAddress: string;
	highestBid: string;
	wildPriceUsd: string;
	onClose: () => void;
};

const AcceptBid = ({
	bid,
	bidData,
	refetch,
	isLoading,
	assetUrl,
	creatorId,
	domainName,
	domainId,
	walletAddress,
	highestBid,
	wildPriceUsd,
	onClose,
}: AcceptBidProps) => {
	//////////////////
	// State & Data //
	//////////////////

	// TODO useBid retrieve data
	// bid, bidData, refetch, isLoading

	// Hooks
	const { accept, status } = useAcceptBid();
	const { instance: sdk } = useZnsSdk();
	const { account, library } = useWeb3React();

	const [currentStep, setCurrentStep] = useState<Step>(Step.LoadingData);
	const [error, setError] = useState<string | undefined>();
	const [stepTitle, setStepTitle] = useState<string>(
		TITLES[Step.Details].PRIMARY,
	);

	useUpdateEffect(() => {
		if (isLoading) {
			setCurrentStep(Step.LoadingData);
		} else {
			setCurrentStep(Step.Details);
		}
	}, [isLoading]);

	// Prevent state update to unmounted component
	const isMounted = useRef(false);

	///////////////
	// Functions //
	///////////////

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
					setCurrentStep(Step.Confirmation);
				} else {
					setCurrentStep(Step.ApproveZAuction);
				}
			} catch (e) {
				// @todo handle error
				console.error(ERRORS.CONSOLE_TEXT, e);
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
				setCurrentStep(Step.Confirmation);
			} catch (e) {
				// @todo handle errors more specifically
				setCurrentStep(Step.ApproveZAuction);
				console.error(STATUS_TEXT.APPROVED, e);
			}
		})();
	};

	const onDetailsAccept = () => {
		setCurrentStep(Step.CheckingZAuctionApproval);
		setStepTitle(TITLES[Step.Confirmation].PRIMARY);
	};

	const onBack = () => {
		setError(undefined);
		setCurrentStep(Step.Details);
	};

	const onConfirm = async () => {
		setCurrentStep(Step.Accepting);
		setStepTitle(TITLES[Step.Accepting].PRIMARY);
		try {
			await accept(bid!);
			setCurrentStep(Step.Success);
			setStepTitle(TITLES[Step.Success].PRIMARY);
		} catch (e) {
			setError(e.message);
			setCurrentStep(Step.Confirmation);
		}
		if (!isMounted.current) return;
	};

	/////////////
	// Effects //
	/////////////
	// Check Z Auction Approval and load data

	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	});

	const steps = {
		// Loading Data
		[Step.LoadingData]: <Wizard.Loading message={MESSAGES.TEXT_LOADING} />,
		// Display NFT details
		[Step.Details]: bidData ? (
			<Details
				assetUrl={assetUrl}
				creator={creatorId}
				domainName={domainName}
				title={stepTitle}
				walletAddress={walletAddress}
				acceptingBid={'bid.amount'}
				highestBid={highestBid}
				wildPriceUsd={wildPriceUsd}
				onClose={onClose}
				onNext={() => onDetailsAccept()}
			/>
		) : (
			<Wizard.Confirmation
				message={MESSAGES.TEXT_FAILED_TO_LOAD}
				primaryButtonText={BUTTONS[Step.Details].TERTIARY}
				onClickPrimaryButton={refetch}
				secondaryButtonText={BUTTONS[Step.Details].SECONDARY}
				onClickSecondaryButton={onClose}
			/>
		),
		// Check zAuction Approval
		[Step.CheckingZAuctionApproval]: (
			<Wizard.Loading message={STATUS_TEXT.CHECK_ZAUCTION} />
		),
		// Approve zAuction
		[Step.ApproveZAuction]: (
			<Wizard.Confirmation
				error={error}
				message={STATUS_TEXT.ACCEPT_ZAUCTION_PROMPT}
				onClickPrimaryButton={approveZAuction}
				onClickSecondaryButton={onClose}
			/>
		),
		// Wait for Wallet
		[Step.WaitingForWallet]: (
			<Wizard.Loading message={STATUS_TEXT.AWAITING_APPROVAL} />
		),
		// Approving zAuction
		[Step.ApprovingZAuction]: (
			<Wizard.Loading message={STATUS_TEXT.APPROVING_ZAUCTION} />
		),
		// Confirm Transaction
		[Step.Confirmation]: (
			<Wizard.Confirmation
				error={error}
				message={MESSAGES.TEXT_CONFIRM_ACCEPT}
				primaryButtonText={BUTTONS[Step.Confirmation].PRIMARY}
				onClickPrimaryButton={onConfirm}
				secondaryButtonText={BUTTONS[Step.Confirmation].SECONDARY}
				onClickSecondaryButton={onBack}
			/>
		),
		// Accepting Bid
		[Step.Accepting]: <Wizard.Loading message={status} />,
		// Bid Accepted
		[Step.Success]: (
			<Success
				assetUrl={assetUrl}
				creator={creatorId}
				domainName={domainName}
				title={stepTitle}
				highestBid={highestBid}
				onClose={onClose}
			/>
		),
	};

	return (
		<Overlay centered open onClose={onClose}>
			<Wizard header={stepTitle}>{steps[currentStep]}</Wizard>
		</Overlay>
	);
};

export default AcceptBid;
