/* eslint-disable react-hooks/exhaustive-deps */
//- React Imports
import { useEffect, useMemo, useRef, useState } from 'react';

//- Global Component Imports
import { Overlay, StepBar, Wizard } from 'components';

//- Components Imports
import Details from './components/Details/Details';

//- Constants Imports
import {
	BUTTONS,
	ERRORS,
	getBidAmountText,
	getSuccessNotification,
	MESSAGES,
	STATUS_TEXT,
	STEP_BAR_HEADING,
	STEP_CONTENT_TITLES,
} from './MakeABid.constants';

//- Library Imports
import { useWeb3React } from '@web3-react/core';
import { useZnsSdk } from 'lib/hooks/sdk';
import { Domain } from 'lib/types';
import { useBidProvider } from 'lib/hooks/useBidProvider';
import useNotification from 'lib/hooks/useNotification';
import useCurrency from 'lib/hooks/useCurrency';
import { useDomainMetadata } from 'lib/hooks/useDomainMetadata';
import { truncateDomain } from 'lib/utils';

//- Hooks
import useBidData from './hooks/useBidData';

//- Styles Imports
import styles from './MakeABid.module.scss';

//- Types Imports
import { Step, StepContent } from './MakeABid.types';
import { ERC20 } from 'types';
import { useZnsContracts } from 'lib/contracts';
import { ethers } from 'ethers';

const maxCharacterLength = 28;

type MakeABidProps = {
	domain: Domain;
	onBid: () => void;
	onClose: () => void;
};

const MakeABid = ({ domain, onBid, onClose }: MakeABidProps) => {
	//////////
	// Data //
	//////////

	const znsContracts = useZnsContracts()!;
	const wildContract: ERC20 = znsContracts.wildToken;

	// Hooks
	const { instance: sdk } = useZnsSdk();
	const { account, library } = useWeb3React();
	const { placeBid } = useBidProvider();
	const { bidData, isLoading } = useBidData(domain.id);
	const { wildPriceUsd } = useCurrency();
	const { addNotification } = useNotification();

	// Refs
	const isMounted = useRef(false);

	// State
	const [wildBalance, setWildBalance] = useState<number | undefined>();
	const [currentStep, setCurrentStep] = useState<Step>(Step.zAuction);
	const [bid, setBid] = useState<string>('');
	const [isBidPlaced, setIsBidPlaced] = useState<boolean>(false);
	const [statusText, setStatusText] = useState<string>('Processing bid');
	const [error, setError] = useState<string | undefined>();
	const [stepContent, setStepContent] = useState<StepContent>(
		StepContent.CheckingZAuctionApproval,
	);
	const domainMetadata = useDomainMetadata(domain.metadata);
	const formattedDomain = truncateDomain(domain.name, maxCharacterLength);
	const isBidValid = !Number.isNaN(parseFloat(bid));

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
				const zAuction = await sdk.getZAuctionInstanceForDomain(domain.id);
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
				const zAuction = await sdk.getZAuctionInstanceForDomain(domain.id);
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

	// Set status text
	const onStep = async (status: string) => {
		setStatusText(status);
	};

	// Confirm bid
	const onConfirm = async () => {
		const bidAmount = Number(bid);
		if (!bidAmount) return;
		setError('');
		setCurrentStep(Step.PlaceBid);
		setStepContent(StepContent.PlacingBid);
		try {
			await placeBid(domain, bidAmount, onStep);
			addNotification(
				getSuccessNotification(getBidAmountText(bid), domain.name),
			);
			setIsBidPlaced(true);
			setStepContent(StepContent.Success);
		} catch (e) {
			setCurrentStep(Step.ConfirmDetails);
			setError(ERRORS.REJECTED_WALLET);
			setStepContent(StepContent.Details);
		}

		if (!isMounted.current) return;
	};

	// Set confirm step button text
	const confirmationErrorButtonText = () =>
		error
			? BUTTONS[StepContent.Details].TERTIARY
			: BUTTONS[StepContent.Details].PRIMARY;

	// Step bar navigation
	const onStepNavigation = (i: number) => {
		setCurrentStep(i);
		setStepContent(i);
	};

	const assetUrl = useMemo(() => {
		return (
			domainMetadata?.animation_url ||
			domainMetadata?.image_full ||
			domainMetadata?.image ||
			''
		);
	}, [domainMetadata]);

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		if (!account) {
			return;
		}

		const fetchTokenBalance = async () => {
			const balance = await wildContract.balanceOf(account);
			setWildBalance(parseInt(ethers.utils.formatEther(balance), 10));
		};
		fetchTokenBalance();
	}, [wildContract, account]);

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
			wildBalance && !isLoading ? (
				<Details
					stepContent={stepContent}
					bidData={bidData}
					assetUrl={assetUrl}
					creator={domain?.minter?.id || ''}
					domainName={formattedDomain}
					title={domainMetadata?.title ?? ''}
					wildBalance={wildBalance}
					wildPriceUsd={wildPriceUsd}
					highestBid={bidData?.highestBid?.amount}
					error={error}
					bid={bid}
					isBidValid={isBidValid}
					setBid={setBid}
					onClose={onClose}
					onConfirm={onConfirm}
				/>
			) : (
				<Wizard.Loading message={MESSAGES.TEXT_LOADING} />
			),

		// Placing Bid
		[StepContent.PlacingBid]: <Wizard.Loading message={statusText} />,
		// Bid Placed
		[StepContent.Success]: wildBalance && (
			<Details
				stepContent={stepContent}
				assetUrl={assetUrl}
				creator={domain?.minter?.id || ''}
				domainName={formattedDomain}
				title={domainMetadata?.title ?? ''}
				wildBalance={wildBalance}
				highestBid={bidData?.highestBid?.amount}
				bid={bid}
				onClose={onBid}
			/>
		),
	};

	return (
		<Overlay centered open onClose={onClose}>
			<Wizard
				header={STEP_CONTENT_TITLES[stepContent]}
				sectionDivider={isBidPlaced}
			>
				{!isBidPlaced && (
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

export default MakeABid;
