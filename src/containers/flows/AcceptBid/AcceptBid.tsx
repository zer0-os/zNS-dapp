/* eslint-disable react-hooks/exhaustive-deps */
//- React Imports
import { useEffect, useRef, useState } from 'react';

//- Global Component Imports
import { Overlay, Wizard, StepBar } from 'components';

//- Components Imports
import Details from './components/Details/Details';

//- Library Imports
import useAcceptBid from './hooks/useAcceptBid';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';
import { Metadata } from 'lib/types';
import { formatBidAmount } from 'lib/utils';
import useNotification from 'lib/hooks/useNotification';
import useCurrency from 'lib/hooks/useCurrency';
import { useWeb3React } from '@web3-react/core';
import { Bid } from '@zero-tech/zauction-sdk';

//- Types Imports
import { StepContent, Step } from './AcceptBid.types';

//- Constants Imports
import {
	BUTTONS,
	ERRORS,
	getSuccessNotification,
	MESSAGES,
	STATUS_TEXT,
	STEP_BAR_HEADING,
	STEP_CONTENT_TITLES,
} from './AcceptBid.constants';

//- Styles Imports
import styles from './AcceptBid.module.scss';

type AcceptBidProps = {
	acceptingBid: Bid | undefined;
	domainMetadata: Metadata | undefined;
	refetch: () => void;
	isLoading?: boolean;
	assetUrl: string;
	creatorId: string;
	domainTitle: string;
	domainId: string;
	domainName: string;
	walletAddress: string;
	highestBid?: string;
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
	onClose,
}: AcceptBidProps) => {
	//////////////////
	// State & Data //
	//////////////////

	// Hooks
	const { accept, status } = useAcceptBid();
	const { instance: sdk } = useZnsSdk();
	const { account, library } = useWeb3React();
	const { wildPriceUsd } = useCurrency();

	//- Notification State
	const { addNotification } = useNotification();

	const [stepContent, setStepContent] = useState<StepContent>(
		StepContent.CheckingZAuctionApproval,
	);
	const [currentStep, setCurrentStep] = useState<Step>(Step.zAuction);
	const [isTransactionComplete, setIsTransactionComplete] =
		useState<boolean>(false);
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
					setCurrentStep(Step.ConfirmDetails);
					setStepContent(StepContent.Details);
				} else {
					setStepContent(StepContent.ApproveZAuction);
				}
			} catch (e) {
				console.log(ERRORS.CONSOLE_TEXT);
				setCurrentStep(Step.zAuction);
				setStepContent(StepContent.FailedToCheckZAuction);
			}
		})();
	};

	// Approve zAuction Flow
	const approveZAuction = () => {
		if (!sdk || !library || !account) {
			return;
		}
		setError(undefined);
		setStepContent(StepContent.WaitingForWallet);
		(async () => {
			try {
				const zAuction = await sdk.getZAuctionInstanceForDomain(domainId);
				const tx = await zAuction.approveZAuctionTransferNft(
					library.getSigner(),
				);
				try {
					setStepContent(StepContent.ApprovingZAuction);
					await tx.wait();
				} catch (e) {
					setStepContent(StepContent.ApproveZAuction);
					setError(ERRORS.TRANSACTION);
				}
				setCurrentStep(Step.ConfirmDetails);
				setStepContent(StepContent.Details);
			} catch (e) {
				setStepContent(StepContent.ApproveZAuction);
				setError(ERRORS.REJECTED_WALLET);
			}
		})();
	};

	const onConfirm = async () => {
		setError('');
		setCurrentStep(Step.AcceptBid);
		setStepContent(StepContent.Accepting);
		try {
			await accept(acceptingBid!);
			addNotification(
				getSuccessNotification(
					formatBidAmount(acceptingBid?.amount),
					domainName,
				),
			);
			setIsTransactionComplete(true);
			setStepContent(StepContent.Success);
		} catch (e) {
			setCurrentStep(Step.ConfirmDetails);
			setError(ERRORS.TRANSACTION);
			setStepContent(StepContent.Details);
		}
		if (!isMounted.current) return;
	};

	const onFinish = async () => {
		if (acceptingBid) {
			onClose();
			refetch();
		}
	};

	const confirmationErrorButtonText = () =>
		error
			? BUTTONS[StepContent.Details].TERTIARY
			: BUTTONS[StepContent.Details].PRIMARY;

	const onStepNavigation = (i: number) => {
		setCurrentStep(i);
		setStepContent(i);
	};

	/////////////
	// Effects //
	/////////////

	// Set initial step
	useEffect(() => {
		if (currentStep === Step.zAuction) {
			setCurrentStep(Step.zAuction);
			setStepContent(StepContent.CheckingZAuctionApproval);
			checkZAuctionApproval();
		}
	}, [currentStep]);

	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	});

	const content = {
		// Failed to check zAuction
		[StepContent.FailedToCheckZAuction]: (
			<Wizard.Confirmation
				error={error}
				message={ERRORS.CONSOLE_TEXT}
				primaryButtonText={BUTTONS[StepContent.FailedToCheckZAuction]}
				onClickPrimaryButton={onClose}
			/>
		),
		// Check zAuction Approval
		[StepContent.CheckingZAuctionApproval]: (
			<Wizard.Loading message={STATUS_TEXT.CHECK_ZAUCTION} />
		),
		// Approve zAuction
		[StepContent.ApproveZAuction]: (
			<Wizard.Confirmation
				error={error}
				message={STATUS_TEXT.ACCEPT_ZAUCTION_PROMPT}
				primaryButtonText={confirmationErrorButtonText()}
				onClickPrimaryButton={approveZAuction}
				onClickSecondaryButton={onClose}
			/>
		),
		// Wait for Wallet
		[StepContent.WaitingForWallet]: (
			<Wizard.Loading message={STATUS_TEXT.AWAITING_APPROVAL} />
		),
		// Approving zAuction
		[StepContent.ApprovingZAuction]: (
			<Wizard.Loading message={STATUS_TEXT.APPROVING_ZAUCTION} />
		),
		// NFT details confirmation
		[StepContent.Details]:
			acceptingBid && !isLoading ? (
				<Details
					error={error}
					stepContent={stepContent}
					assetUrl={assetUrl}
					creator={creatorId}
					domainName={domainName}
					title={domainTitle}
					walletAddress={walletAddress}
					bidAmount={acceptingBid.amount}
					highestBid={highestBid}
					wildPriceUsd={wildPriceUsd}
					onClose={onClose}
					onNext={onConfirm}
				/>
			) : (
				<Wizard.Loading message={MESSAGES.TEXT_LOADING} />
			),
		// Accepting Bid
		[StepContent.Accepting]: <Wizard.Loading message={status} />,
		// Bid Accepted
		[StepContent.Success]: (
			<Details
				error={error}
				stepContent={stepContent}
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
			<Wizard
				header={STEP_CONTENT_TITLES[stepContent]}
				sectionDivider={isTransactionComplete}
			>
				{!isTransactionComplete && (
					<div className={styles.StepBarContainer}>
						<StepBar
							step={currentStep + 1}
							steps={STEP_BAR_HEADING}
							onNavigate={onStepNavigation}
						/>
					</div>
				)}
				{content[stepContent]}
			</Wizard>
		</Overlay>
	);
};

export default AcceptBid;
