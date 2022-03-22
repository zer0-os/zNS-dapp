//- React Imports
import { useEffect, useRef, useState } from 'react';

//- Global Component Imports
import { Overlay, Wizard } from 'components';

//- Components Imports
import Details from './components/Details/Details';
import Success from './components/Success/Success';

//- Library Imports
import useAcceptBid from './hooks/useAcceptBid';
import { useWeb3React } from '@web3-react/core';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';
import { Bid } from '@zero-tech/zauction-sdk';
import { Metadata } from 'lib/types';

//- Types Imports
import { Step } from './AcceptBid.types';

//- Constants Imports
import {
	BUTTONS,
	ERRORS,
	MESSAGES,
	STATUS_TEXT,
	STEP_TITLES,
} from './AcceptBid.constants';

type AcceptBidProps = {
	acceptingBid: Bid | undefined;
	domainMetadata: Metadata | undefined;
	refetch?: (bid: Bid) => void;
	isLoading?: boolean;
	assetUrl: string;
	creatorId: string;
	domainTitle: string;
	domainId: string;
	domainName: string;
	walletAddress: string;
	highestBid?: string;
	wildPriceUsd?: number;
	onClose: () => void;
};

const AcceptBid = ({
	acceptingBid,
	refetch,
	isLoading,
	assetUrl,
	creatorId,
	domainTitle,
	domainId,
	domainName,
	walletAddress,
	highestBid,
	wildPriceUsd,
	onClose,
}: AcceptBidProps) => {
	//////////////////
	// State & Data //
	//////////////////

	// Hooks
	const { accept, status } = useAcceptBid();
	const { instance: sdk } = useZnsSdk();
	const { account, library } = useWeb3React();

	const [currentStep, setCurrentStep] = useState<Step>(Step.LoadingData);
	const [error, setError] = useState<string | undefined>();

	// Prevent state update to unmounted component
	const isMounted = useRef(false);

	///////////////
	// Functions //
	///////////////

	// Check zAuction Approval
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
				// Timeout to prevent jolt
				await new Promise((r) => setTimeout(r, 1500));
				if (isApproved) {
					setCurrentStep(Step.Confirmation);
				} else {
					setCurrentStep(Step.ApproveZAuction);
				}
			} catch (e) {
				setError(ERRORS.CONSOLE_TEXT);
				setCurrentStep(Step.Confirmation);
				console.error(ERRORS.CONSOLE_TEXT, e);
			}
		})();
	};

	// Approve zAuction Flow
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
				try {
					setCurrentStep(Step.ApprovingZAuction);
					await tx.wait();
				} catch (e) {
					setCurrentStep(Step.ApproveZAuction);
					setError(ERRORS.TRANSACTION);
				}
				setCurrentStep(Step.Confirmation);
			} catch (e) {
				setCurrentStep(Step.ApproveZAuction);
				setError(ERRORS.REJECTED_WALLET);
			}
		})();
	};

	const onDetailsAccept = () => {
		setCurrentStep(Step.CheckingZAuctionApproval);
		checkZAuctionApproval();
	};

	const onBack = () => {
		setError(undefined);
		setCurrentStep(Step.Details);
	};

	const onConfirm = async () => {
		setCurrentStep(Step.Accepting);
		try {
			await accept(acceptingBid!);
			setCurrentStep(Step.Success);
		} catch (e) {
			setError(e.message);
			setCurrentStep(Step.Confirmation);
		}
		if (!isMounted.current) return;
	};

	const onFinish = async () => {
		if (acceptingBid && refetch) {
			refetch(acceptingBid);
			onClose();
		}
	};

	const confirmationErrorButtonText = () =>
		error
			? BUTTONS[Step.Confirmation].TERTIARY
			: BUTTONS[Step.Confirmation].PRIMARY;

	/////////////
	// Effects //
	/////////////

	// Set initial step
	useEffect(() => {
		if (isLoading) {
			setCurrentStep(Step.LoadingData);
		} else {
			setCurrentStep(Step.Details);
		}
	}, [isLoading]);

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
		[Step.Details]: acceptingBid ? (
			<Details
				assetUrl={assetUrl}
				creator={creatorId}
				domainName={domainName}
				title={domainTitle}
				walletAddress={walletAddress}
				bidAmount={acceptingBid.amount}
				highestBid={highestBid}
				wildPriceUsd={wildPriceUsd}
				onClose={onClose}
				onNext={() => onDetailsAccept()}
			/>
		) : (
			<Wizard.Confirmation
				message={MESSAGES.TEXT_FAILED_TO_LOAD}
				primaryButtonText={BUTTONS[Step.Details].TERTIARY}
				onClickPrimaryButton={() => onDetailsAccept()}
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
				primaryButtonText={confirmationErrorButtonText()}
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
				primaryButtonText={confirmationErrorButtonText()}
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
				title={domainTitle}
				highestBid={highestBid}
				bidAmount={acceptingBid?.amount ?? ''}
				onClose={onFinish}
			/>
		),
	};

	return (
		<Overlay centered open onClose={onClose}>
			<Wizard header={STEP_TITLES[currentStep]}>{steps[currentStep]}</Wizard>
		</Overlay>
	);
};

export default AcceptBid;
