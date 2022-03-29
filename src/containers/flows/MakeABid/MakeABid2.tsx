/* eslint-disable react-hooks/exhaustive-deps */
//- React Imports
import { useEffect, useMemo, useRef, useState } from 'react';

//- Global Component Imports
import {
	FutureButton,
	LoadingIndicator,
	NFTMedia,
	Overlay,
	StepBar,
	TextInput,
	Wizard,
} from 'components';

//- Components Imports

//- Containers Imports
import { BidList } from 'containers';

//- Library Imports
import { useWeb3React } from '@web3-react/core';
import { useZnsSdk } from 'lib/hooks/sdk';
import { Domain, Maybe } from 'lib/types';
import { useBidProvider } from 'lib/hooks/useBidProvider';
import useNotification from 'lib/hooks/useNotification';
import { formatBidAmount } from 'lib/utils';
import useCurrency from 'lib/hooks/useCurrency';
import { useDomainMetadata } from 'lib/hooks/useDomainMetadata';

//- Hooks
import useBidData from './hooks/useBidData';

//- Styles Imports
import styles from './MakeABid.module.scss';

//- Types Imports
import { Step, StepContent } from './MakeABid.types';
import { ERC20 } from 'types';
import { useZnsContracts } from 'lib/contracts';
import { ethers } from 'ethers';

//- Constants Imports
import {
	BUTTONS,
	ERRORS,
	getSuccessNotification,
	MESSAGES,
	STATUS_TEXT,
	STEP_BAR_HEADING,
	STEP_CONTENT_TITLES,
} from './MakeABid.constants';
import { toFiat } from 'lib/currency';

type MakeABidProps = {
	domain: Domain;
	onBid: () => void;
};

const MakeABid = ({ domain, onBid }: MakeABidProps) => {
	//////////////////
	// State & Data //
	//////////////////

	// Hooks
	const { instance: sdk } = useZnsSdk();
	const { account, library } = useWeb3React();
	const { placeBid } = useBidProvider();
	const { bidData } = useBidData(domain.id);
	const { wildPriceUsd } = useCurrency();
	const { addNotification } = useNotification();
	const domainMetadata = useDomainMetadata(domain.metadata);

	const [stepContent, setStepContent] = useState<StepContent>(
		StepContent.CheckingZAuctionApproval,
	);
	const [wildBalance, setWildBalance] = useState<number | undefined>();
	const [currentStep, setCurrentStep] = useState<Step>(Step.zAuction);
	const [bid, setBid] = useState<string>('');
	const [isBidPlaced, setIsBidPlaced] = useState<boolean>(false);
	const [statusText, setStatusText] = useState<string>('Processing bid');
	const [error, setError] = useState<string | undefined>();
	const [isAllBidsModalOpen, setIsAllBidsModalOpen] = useState(false);
	const [isBidPending] = useState(false);

	// Prevent state update to unmounted component
	const isMounted = useRef(false);

	const znsContracts = useZnsContracts()!;
	const wildContract: ERC20 = znsContracts.wildToken;

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

	const onStep = async (status: string) => {
		setStatusText(status);
	};

	const onConfirm = async () => {
		const bidAmount = Number(bid);
		if (!bidAmount) return;

		setError('');
		setCurrentStep(Step.PlaceBid);
		setStepContent(StepContent.PlacingBid);
		try {
			await placeBid(domain, bidAmount, onStep);
			addNotification(
				getSuccessNotification(formatBidAmount(String(bidAmount)), domain.name),
			);
			setIsBidPlaced(true);
			setStepContent(StepContent.Success);
		} catch (e) {
			setCurrentStep(Step.ConfirmDetails);
			setError(ERRORS.TRANSACTION);
			setStepContent(StepContent.Details);
		}

		if (!isMounted.current) return;
	};

	// const onFinish = async () => {
	// 	if (bid) {
	// 		onBid();
	// 	}
	// };

	console.log(currentStep);
	console.log(stepContent);

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

	const loadingWildBalance = wildBalance === undefined;

	const modals = () => {
		if (isAllBidsModalOpen && bidData?.bids !== undefined) {
			return (
				<Overlay open onClose={() => setIsAllBidsModalOpen(false)} centered>
					<BidList bids={bidData.bids} wildPriceUsd={wildPriceUsd} />
				</Overlay>
			);
		} else {
			return <></>;
		}
	};

	const ipfsUrl = useMemo(() => {
		return (
			domainMetadata?.animation_url ||
			domainMetadata?.image_full ||
			domainMetadata?.image ||
			''
		);
	}, [domainMetadata]);

	const nft = () => (
		<div className={styles.NFT}>
			<NFTMedia
				alt="Bid NFT preview"
				style={{ objectFit: 'contain', position: 'absolute', zIndex: 2 }}
				ipfsUrl={ipfsUrl}
				size="small"
			/>
		</div>
	);

	const estimation = () => {
		const isBidValid = !Number.isNaN(parseFloat(bid));
		const bidString = isBidValid
			? toFiat(parseFloat(bid) * wildPriceUsd)
			: '0.00';

		return (
			wildPriceUsd > 0 && (
				<>
					<span className={styles.Estimate}>Approx. ${bidString} USD</span>
				</>
			)
		);
	};

	const formSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		onConfirm();
	};

	const details = () => (
		<div className={styles.Details}>
			<h2 className="glow-text-white">{domainMetadata?.title}</h2>
			<span className={styles.Domain}>0://{'formattedDomain'}</span>
			<div className={styles.Price}>
				<h3 className="glow-text-blue">Highest Bid</h3>
			</div>
		</div>
	);

	const isBidValid = useMemo(() => {
		return (
			(Number(bid) &&
				wildBalance &&
				Number(bid) <= wildBalance &&
				Number(bid) > 0) === true
		);
	}, [bid]);

	const bidStep = () => {
		let bidTooHighWarning: Maybe<React.ReactFragment> = null;

		if (!loadingWildBalance && Number(bid) > wildBalance!) {
			bidTooHighWarning = (
				<>
					<p className={styles.Error} style={{ paddingTop: '16px' }}>
						You don't have enough WILD to make that large of a bid
					</p>
				</>
			);
		}

		return (
			<>
				{modals()}
				<div
					className={styles.Section}
					style={{ display: 'flex', padding: '0 37.5px' }}
				>
					{nft()}
					{details()}
				</div>
				<div className={styles.InputWrapper}>
					{domain.owner.id.toLowerCase() === account?.toLowerCase() && (
						<p className={styles.Error} style={{ paddingTop: '16px' }}>
							You can not bid on your own domain
						</p>
					)}
					{domain.owner.id.toLowerCase() !== account?.toLowerCase() && (
						<>
							{loadingWildBalance && (
								<>
									<LoadingIndicator text="Checking WILD Balance" />
								</>
							)}
							{!loadingWildBalance && (
								<>
									<p className="glow-text-blue">
										Enter the amount you wish to bid:
									</p>
									<span
										style={{ marginBottom: 16 }}
										className={styles.Estimate}
									>
										Your Balance: {Number(wildBalance).toLocaleString()} WILD
									</span>
									<form onSubmit={formSubmit}>
										<TextInput
											onChange={(text: string) => setBid(text)}
											placeholder="Bid amount (WILD)"
											error={Boolean(error)}
											errorText={error}
											numeric
											text={bid}
											style={{ width: 268, margin: '0 auto' }}
										/>
									</form>
									{estimation()}
									{bidTooHighWarning}
									<FutureButton
										style={{
											height: 36,
											borderRadius: 18,
											textTransform: 'uppercase',
											margin: '32px auto 0 auto',
										}}
										loading={isBidPending}
										onClick={() => {
											if (!isBidValid) {
												return;
											}

											onConfirm();
										}}
										glow={isBidValid}
									>
										Continue
									</FutureButton>
								</>
							)}
						</>
					)}
				</div>
			</>
		);
	};

	const content = {
		// Failed to check zAuction
		[StepContent.FailedToCheckZAuction]: (
			<Wizard.Confirmation
				error={error}
				message={ERRORS.CONSOLE_TEXT}
				primaryButtonText={BUTTONS[StepContent.FailedToCheckZAuction]}
				onClickPrimaryButton={onBid}
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
				onClickSecondaryButton={onBid}
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
		[StepContent.Details]: bidStep(),

		// Placing Bid
		[StepContent.PlacingBid]: <Wizard.Loading message={statusText} />,
		// Bid Placed
		[StepContent.Success]: 'YOLO2',
	};

	return (
		<Overlay centered open onClose={onBid}>
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
