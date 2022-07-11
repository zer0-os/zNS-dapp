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
	getBidAmountText,
	getSuccessNotification,
	MESSAGES,
	STATUS_TEXT,
	STEP_BAR_HEADING,
	STEP_CONTENT_TITLES,
} from './MakeABid.constants';
import { ERRORS } from 'constants/errors';

//- Library Imports
import { useWeb3React } from '@web3-react/core';
import { useZnsSdk } from 'lib/hooks/sdk';
import { Domain } from 'lib/types';
import { useBidProvider } from 'lib/hooks/useBidProvider';
import useNotification from 'lib/hooks/useNotification';
import useCurrency from 'lib/hooks/useCurrency';
import { useDomainMetadata } from 'lib/hooks/useDomainMetadata';
import { truncateDomain } from 'lib/utils';
import { BigNumber, ethers } from 'ethers';
import { useDidMount } from 'lib/hooks/useDidMount';
import { useZnsContracts } from 'lib/contracts';

//- Hooks Imports
import useBidData from './hooks/useBidData';

//- Utils Imports
import { getDisplayErrorMessage } from 'lib/utils/error';

//- Types Imports
import { Step, StepContent } from './MakeABid.types';
import { ERC20 } from 'types';

//- Styles Imports
import styles from './MakeABid.module.scss';

const maxCharacterLength = 28;

export type MakeABidProps = {
	domain: Domain;
	onBid: () => void;
	onClose: () => void;
};

const MakeABid = ({ domain, onBid, onClose }: MakeABidProps) => {
	//////////
	// Data //
	//////////

	// Contracts
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
	// NOTE: has to handle metadataUri as we are currently working with
	// 2 Domain types - one in lib/types and one from SDK
	const domainMetadata = useDomainMetadata(
		domain.metadata ?? (domain as any).metadataUri,
	);
	const formattedDomain = truncateDomain(domain.name, maxCharacterLength);
	const isBidValid = !Number.isNaN(parseFloat(bid));

	///////////////
	// Functions //
	///////////////

	/**
	 * Controls modal state and calls SDK methods for what happens
	 * when the modal checks zAuction approval status
	 * @returns void
	 */
	const checkZAuctionApproval = () => {
		if (!sdk || !library || !account) {
			return;
		}
		setError(undefined);
		setCurrentStep(Step.zAuction);
		setStepContent(StepContent.CheckingZAuctionApproval);
		(async () => {
			try {
				const needsApproval =
					await sdk.zauction.needsToApproveZAuctionToSpendTokens(
						domain.id,
						account,
						BigNumber.from('1000000000'),
					);
				// Timeout to prevent jolt
				await new Promise((r) => setTimeout(r, 1500));
				if (needsApproval) {
					setCurrentStep(Step.ConfirmDetails);
					setStepContent(StepContent.Details);
				} else {
					setStepContent(StepContent.ApproveZAuction);
				}
			} catch (e) {
				console.log(ERRORS.FAILED_TO_CHECK_ZAUCTION);
				setCurrentStep(Step.zAuction);
				setStepContent(StepContent.FailedToCheckZAuction);
			}
		})();
	};

	/**
	 * Controls modal state and calls SDK methods for what happens
	 * when the user approves zAuction
	 * @returns void
	 */
	const approveZAuction = () => {
		if (!sdk || !library || !account) {
			return;
		}
		setError(undefined);
		setStepContent(StepContent.WaitingForWallet);
		(async () => {
			try {
				const tx = await sdk.zauction.approveZAuctionToSpendTokens(
					domain.id,
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
			} catch (e: any) {
				setStepContent(StepContent.ApproveZAuction);
				setError(getDisplayErrorMessage(e.message));
			}
		})();
	};

	// Set status text
	const onStep = async (status: string) => {
		setStatusText(status);
	};

	/**
	 * Controls modal state and calls SDK methods for what happens
	 * when the user confirms their bid
	 * @returns void
	 */
	const onConfirm = async () => {
		const bidAmount = Number(bid);
		if (!bidAmount) return;
		setError('');
		setCurrentStep(Step.PlaceBid);
		setStepContent(StepContent.PlacingBid);
		try {
			await placeBid(domain, bidAmount, onStep);
			if (!isMounted.current) {
				return;
			}
			addNotification(
				getSuccessNotification(getBidAmountText(bid), domain.name),
			);
			setIsBidPlaced(true);
			setStepContent(StepContent.Success);
		} catch (e: any) {
			if (!isMounted.current) {
				return;
			}
			setCurrentStep(Step.ConfirmDetails);
			console.error(e);
			setError(getDisplayErrorMessage(e.message));
			setStepContent(StepContent.Details);
		}
	};

	// Set confirm step button text
	const confirmationErrorButtonText = () =>
		error
			? BUTTONS[StepContent.Details].TERTIARY
			: BUTTONS[StepContent.Details].PRIMARY;

	/**
	 * Handles navigating between steps
	 * @param i step number to navigate to
	 */
	const onStepNavigation = (i: number) => {
		setCurrentStep(i);
		setStepContent(i);
	};

	/**
	 * URL to the image for the NFT being bidded on
	 */
	const assetUrl = useMemo(() => {
		return (
			domainMetadata?.animation_url ||
			domainMetadata?.image_full ||
			domainMetadata?.image ||
			''
		);
	}, [domainMetadata]);

	/**
	 * Triggers calls to get zAuction approval status and WILD balance
	 * for the connect account/wallet.
	 * Saves these variables to state, rather than returns them.
	 * @returns void
	 */
	const getAccountData = () => {
		if (!account) {
			return;
		}
		checkZAuctionApproval();
		wildContract.balanceOf(account).then((balance) => {
			setWildBalance(parseInt(ethers.utils.formatEther(balance), 10));
		});
	};

	/////////////
	// Effects //
	/////////////

	useEffect(getAccountData, [wildContract, account]);
	useDidMount(() => {
		isMounted.current = true;
		getAccountData();
		return () => {
			isMounted.current = false;
		};
	});

	///////////////////
	// Modal Content //
	///////////////////

	const content = {
		// Failed to check zAuction
		[StepContent.FailedToCheckZAuction]: (
			<Wizard.Confirmation
				error={error}
				message={ERRORS.FAILED_TO_CHECK_ZAUCTION}
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
			wildBalance !== undefined && !isLoading ? (
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
				bidData={bidData}
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
