/* eslint-disable react-hooks/exhaustive-deps */
// React Imports
import React, { useEffect, useState } from 'react';
//- Web3 Imports
import { useWeb3React } from '@web3-react/core'; // Wallet data
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'; // Wallet data
// Library Imports
import { useZnsContracts } from 'lib/contracts';
import { useBidProvider } from 'lib/providers/BidProvider';
import { useApprovals } from 'lib/hooks/useApprovals';
import { useDomainsOwnedByUserQuery } from 'lib/hooks/zNSDomainHooks';
import { toFiat } from 'lib/currency';
import { getMetadata } from 'lib/metadata';
import { useCurrencyProvider } from 'lib/providers/CurrencyProvider';
import useNotification from 'lib/hooks/useNotification';
import { ethers } from 'ethers';
import { ERC20 } from 'types';
// Type Imports
import { Bid, Domain, DomainData, Maybe, Metadata } from 'lib/types';
// Component Imports
import {
	DomainTable,
	FutureButton,
	Member,
	NFTMedia,
	Overlay,
	Spinner,
	StepBar,
} from 'components';
// Containers Imports
import { BidList } from 'containers';
// Constants
import {
	NO_ERROR,
	LOW_BALANCE,
	CHECK_GAS_STATUS,
	ACCEPT_ZAUCTION_PROMPT,
	APPROVAL_REJECTED,
	ZAUCTION_PROMPT,
	CANCEL_BTN,
	CONTINUE_BTN,
	FAIL_TO_CALCULATE_GAS,
	FAILED_TRANSACTION,
	APPROVING_ZAUCTION,
	ACCEPTING_BID,
	FAILED_TO_APPROVE,
	WILD_CURRENCY_CODE,
	LOADING_BIDS,
	CREATOR_LABEL,
	HIGHEST_BID_LABEL,
	SELECTED_BID_LABEL,
	CONFIRM_BID_AMOUNT,
	USD_CURRENCY_CODE,
	AWAITING_APPROVAL,
	SUCCESS_CONFIRMATION,
	FINISH_BTN,
	LOADING_DOMAINS_LABEL,
	CHECKING_ZAUCTION_STATUS,
} from './constants';
// Utils
import { AcceptBidModalData, OwnedDomainTableProps, Steps } from './utils';
// Style Imports
import styles from './OwnedDomainsTable.module.scss';

const OwnedDomainTables: React.FC<OwnedDomainTableProps> = ({ onNavigate }) => {
	// Bid hooks
	const { acceptBid, getBidsForDomain } = useBidProvider();
	// Notification Confirmation
	const { addNotification } = useNotification();
	// Wild to usd
	const { wildPriceUsd } = useCurrencyProvider();
	// zAuction Integrations
	const { approveAllTokens, isApprovedForAllTokens } = useApprovals();
	const znsContracts = useZnsContracts()!;
	const zAuctionAddress = znsContracts.zAuction.address;
	// Wallet Integrations
	const walletContext = useWeb3React<Web3Provider>();
	const { account, active } = walletContext;
	const wildContract: ERC20 = znsContracts.wildToken;
	const ownedDomainPollingInterval: number = 5000;
	// Queries
	const ownedQuery = useDomainsOwnedByUserQuery(
		account!,
		ownedDomainPollingInterval,
	);
	const owned = ownedQuery.data?.domains;

	//////////////////
	// State & Data //
	//////////////////

	const [step, setStep] = useState<Steps>(Steps.Approve);
	const [bids, setBids] = useState<Bid[] | undefined>([]);
	const [currentHighestBid, setCurrentHighestBid] = useState<Bid | undefined>();
	const [currentHighestBidUsd, setCurrentHighestBidUsd] = useState<
		number | undefined
	>();
	const [domainMetadata, setDomainMetadata] = useState<Metadata | undefined>();
	const [error, setError] = useState('');
	const [statusText, setStatusText] = useState<string>('');
	const [acceptingBid, setAcceptingBid] = React.useState<
		AcceptBidModalData | undefined
	>();
	const [viewingDomain, setViewingDomain] = React.useState<
		DomainData | undefined
	>();
	// Loading States
	const [isTableLoading, setIsTableLoading] = React.useState(true);
	const [isAccepting, setIsAccepting] = React.useState(false);
	const [isGridView, setIsGridView] = React.useState(false);
	const [isApprovalInProgress, setIsApprovalInProgress] = useState(false);
	const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);
	const [isBidConfirmed, setIsBidConfirmed] = useState(false);
	const [hasBidDataLoaded, setHasBidDataLoaded] = useState(false);
	const [hasApprovedZAuction, setHasApprovedZAuction] = useState<
		boolean | undefined
	>();

	///////////////
	// Functions //
	///////////////

	// Steps Functions
	const approveZAuction = async () => {
		setError(NO_ERROR);
		setStatusText(CHECK_GAS_STATUS);
		setIsApprovalInProgress(true);

		// Check User Balance (Gas)
		try {
			const gasRequired = await wildContract.estimateGas.approve(
				zAuctionAddress,
				ethers.constants.MaxUint256,
			);
			const gasPrice = await wildContract.signer.getGasPrice();
			const userBalance = await wildContract.signer.getBalance();

			const totalPrice = gasPrice.mul(gasRequired);
			if (userBalance.lt(totalPrice)) {
				setError(LOW_BALANCE);
				setIsApprovalInProgress(false);
				return;
			}
		} catch (e) {
			console.error(e);
			setError(FAIL_TO_CALCULATE_GAS);
			setIsApprovalInProgress(false);
			return;
		}

		// User Wallet Interaction
		setStatusText(ACCEPT_ZAUCTION_PROMPT);

		let tx: Maybe<ethers.ContractTransaction>;
		try {
			tx = await wildContract.approve(
				zAuctionAddress,
				ethers.constants.MaxUint256,
			);
		} catch (e) {
			console.error(e);
			if (e.code === 4001) {
				setError(APPROVAL_REJECTED);
			} else {
				setError(FAILED_TRANSACTION);
			}
			setIsApprovalInProgress(false);
			return;
		}

		// Await Approval
		setStatusText(APPROVING_ZAUCTION);
		try {
			await tx.wait();
		} catch (e) {
			setError(FAILED_TRANSACTION);
			console.error(e);
			setIsApprovalInProgress(false);
			return;
		}

		// Complete zAuction Approval
		setHasApprovedZAuction(true);
		setIsApprovalInProgress(false);
	};

	const acceptBidConfirmed = async () => {
		setError(NO_ERROR);
		if (!acceptingBid) {
			return;
		}
		setIsAccepting(true);
		setStatusText(AWAITING_APPROVAL);

		// User Wallet Interaction
		// const tx = await acceptBid(acceptingBid.bid);
		let tx: Maybe<ethers.ContractTransaction>;
		try {
			tx = await acceptBid(acceptingBid.bid);
			setStatusText(ACCEPTING_BID);
			// Set Accept Step
			setStep(Steps.Accept);
			if (tx) {
				await tx.wait();
			}
			setTimeout(() => {
				//refetch after confirm the transaction, with a delay to wait until backend gets updated
				ownedQuery.refetch();
			}, 500);
			setIsBidConfirmed(true);
		} catch (e) {
			setError(APPROVAL_REJECTED);
			setIsAccepting(false);
		}
		try {
			await tx?.wait();
		} catch (e) {
			setError(FAILED_TRANSACTION);
			console.error(e);
			setIsAccepting(false);
		}
		setIsAccepting(false);
	};

	const closeBid = () => {
		setAcceptingBid(undefined);
		setError(NO_ERROR);
	};

	// Domain Table Functions
	const rowClick = (domain: Domain) => {
		if (onNavigate) onNavigate(domain.name);
	};

	const isButtonActive = (row: any[]) => {
		return row.length > 0;
	};

	const tableLoaded = () => {
		setIsTableLoading(false);
	};

	const viewBid = async (domain: DomainData) => {
		setViewingDomain(domain);
	};

	const isApproved = async () => {
		const approved = await isApprovedForAllTokens({
			owner: account as string,
			operator: zAuctionAddress,
		});
		return approved;
	};

	const accept = async (bid: Bid) => {
		if (!viewingDomain?.domain || !bid) return;
		setAcceptingBid({
			domain: viewingDomain.domain,
			bid: bid,
		});
		const shouldApprove = !(await isApproved());
		if (shouldApprove) {
			try {
				const approvedSuccess = await approve();
				if (approvedSuccess) throw Error(FAILED_TO_APPROVE);
			} catch (e: any) {
				closeBid();
			}
		}
	};

	const approve = async () => {
		const approved = await approveAllTokens({
			operator: zAuctionAddress,
			approved: true,
		});
		return approved;
	};

	const closeDomain = () => setViewingDomain(undefined);

	const checkZAuctionApproval = async () => {
		setIsCheckingAllowance(true);
		setStatusText(CHECKING_ZAUCTION_STATUS);
		await new Promise((r) => setTimeout(r, 800)); // Add a timeout so we can show the user a message for UX
		if (hasApprovedZAuction) {
			setIsCheckingAllowance(false);
			setStep(Steps.Confirm);
		} else {
			setIsCheckingAllowance(false);
			setHasApprovedZAuction(false);
		}
	};

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		if (hasApprovedZAuction && step === Steps.Approve) {
			setStep(Steps.Confirm);
		}
	}, [hasApprovedZAuction]);

	useEffect(() => {
		setError(NO_ERROR);
		if (step === Steps.Approve) {
			checkZAuctionApproval();
		}
	}, [step]);

	useEffect(() => {
		if (!acceptingBid) {
			return;
		}
		let isSubscribed = true;

		const loadDomainData = async () => {
			const metadata = await getMetadata(acceptingBid.domain.metadata);
			if (!metadata) return;

			if (isSubscribed) {
				setDomainMetadata(metadata);
			}
		};

		loadDomainData();

		return () => {
			isSubscribed = false;
		};
	}, [acceptingBid, acceptingBid?.domain, wildPriceUsd]);

	useEffect(() => {
		if (!acceptingBid) {
			return;
		}
		let isSubscribed = true;

		const getCurrentHighestBid = async () => {
			// Get highest bid
			const allBids = await getBidsForDomain(acceptingBid?.domain);

			if (!allBids || allBids.length === 0) {
				setHasBidDataLoaded(true);
				return;
			}
			const highestBid = allBids.reduce(function (prev, current) {
				return prev.amount > current.amount ? prev : current;
			});

			if (isSubscribed) {
				setHasBidDataLoaded(true);
				setBids(allBids);
				setCurrentHighestBid(highestBid);
				setCurrentHighestBidUsd(highestBid.amount * wildPriceUsd);
			}
		};

		getCurrentHighestBid();

		return () => {
			isSubscribed = false;
		};
	}, [acceptingBid, acceptingBid?.domain, wildPriceUsd]);

	/////////////////////
	// React Fragments //
	/////////////////////

	// Handle Errors
	let errorMessage: Maybe<React.ReactFragment>;
	if (error) {
		errorMessage = (
			<p
				style={{ textAlign: 'center', margin: '24px 0' }}
				className={styles.Error}
			>
				{error}
			</p>
		);
	}

	// Helpers
	const highestBid = () => {
		const hasBids = bids !== undefined && bids.length > 0;
		const highestCurrentBid = `${Number(
			currentHighestBid?.amount,
		).toLocaleString()} ${WILD_CURRENCY_CODE}`;
		const isCurrentHighestBidUsd =
			currentHighestBidUsd !== undefined && currentHighestBidUsd > 0;

		return (
			<div style={{ display: 'flex', alignItems: 'baseline' }}>
				<span>
					{!hasBidDataLoaded && <>{LOADING_BIDS}</>}
					{hasBids && currentHighestBid && <>{highestCurrentBid}</>}
				</span>
				{isCurrentHighestBidUsd && (
					<p className="glow-text-blue" style={{ marginLeft: '8px' }}>
						${toFiat(Number(currentHighestBidUsd))}
					</p>
				)}
			</div>
		);
	};

	const selectedBid = () => {
		const hasBids = bids !== undefined && bids.length > 0;
		const acceptingBidUsd =
			acceptingBid && acceptingBid.bid.amount * wildPriceUsd;
		const acceptBidAmount = `${Number(
			acceptingBid?.bid.amount,
		).toLocaleString()} ${WILD_CURRENCY_CODE}`;
		const isAcceptingBidUsd =
			acceptingBidUsd !== undefined && acceptingBidUsd > 0;

		return (
			<div style={{ display: 'flex', alignItems: 'baseline' }}>
				<span>
					{!hasBidDataLoaded && <>{LOADING_BIDS}</>}
					{hasBids && acceptingBid && <>{acceptBidAmount}</>}
				</span>
				{isAcceptingBidUsd && (
					<p className="glow-text-blue" style={{ marginLeft: '8px' }}>
						${toFiat(Number(acceptingBidUsd))}
					</p>
				)}
			</div>
		);
	};

	const details = () => (
		<div className={styles.Details}>
			<h2 style={{ lineHeight: '29px' }}>{domainMetadata?.title}</h2>
			<span className={styles.Domain}>0://{acceptingBid?.domain?.name}</span>
			<div className={styles.Price}>
				<h3 className="glow-text-blue">{CREATOR_LABEL}</h3>
				<Member
					id={acceptingBid?.domain?.minter?.id || ''}
					name={''}
					image={''}
				/>
			</div>
			<div className={styles.Price}>
				<h3 className="glow-text-blue">{HIGHEST_BID_LABEL}</h3>
				<div>{highestBid()}</div>
			</div>
			<div className={styles.Price}>
				<h3 className="glow-text-blue">{SELECTED_BID_LABEL}</h3>
				<div>{selectedBid()}</div>
			</div>
		</div>
	);

	const nft = () => (
		<div className={styles.NFT}>
			<NFTMedia
				alt="Bid NFT preview"
				style={{ objectFit: 'contain', position: 'absolute', zIndex: 2 }}
				ipfsUrl={domainMetadata?.image_full || domainMetadata?.image || ''}
				size="small"
			/>
		</div>
	);

	const loadingState = () => (
		<>
			<p
				className={styles.Loading}
				style={{ lineHeight: '24px', textAlign: 'center' }}
			>
				{statusText}
			</p>
			<Spinner style={{ margin: '40px auto 20px auto' }} />
		</>
	);

	const header = () => {
		const approveHeading = `Approve zAuction`;
		const acceptHeading = `Accept Bid`;
		const heading = step === Steps.Approve ? approveHeading : acceptHeading;
		return (
			<>
				<div className={styles.Header}>
					<h1 className={`glow-text-white`}>{heading}</h1>
				</div>
			</>
		);
	};

	// Render nothing if wallet disconnected or no domains owned
	if (!active || !owned) return <></>;

	// Wizard Step 1/3 Approve Fragment
	const approveZAuctionStep = () => (
		<div
			className={styles.Section}
			style={{
				display: 'flex',
				flexDirection: 'column',
				padding: '0 12px',
				textAlign: 'center',
			}}
		>
			{!isApprovalInProgress && !isCheckingAllowance && (
				<>
					{!hasApprovedZAuction && (
						<>
							<p style={{ lineHeight: '24px' }}>{ZAUCTION_PROMPT}</p>

							{errorMessage}

							<div className={styles.CTAContainer}>
								<div>
									<FutureButton
										glow
										alt
										style={{
											height: 36,
											width: 140,
											borderRadius: 18,
											textTransform: 'uppercase',
											margin: '16px auto 0 auto',
										}}
										onClick={closeBid}
									>
										{CANCEL_BTN}
									</FutureButton>
								</div>
								<div>
									<FutureButton
										glow
										style={{
											height: 36,
											width: 140,
											borderRadius: 18,
											textTransform: 'uppercase',
											margin: '16px auto 0 auto',
										}}
										onClick={approveZAuction}
									>
										{CONTINUE_BTN}
									</FutureButton>
								</div>
							</div>
						</>
					)}
				</>
			)}
			{isCheckingAllowance && loadingState()}
			{isApprovalInProgress && loadingState()}
		</div>
	);

	// Wizard Step 2/3 Confirm Fragment
	const confirmStep = () => {
		if (isBidConfirmed) {
			setStep(Steps.Accept);
			bidAcceptedStep();
		}
		const acceptingBidUSD =
			acceptingBid && acceptingBid.bid.amount * wildPriceUsd;
		const truncatedAccountAddress = `${acceptingBid?.bid.bidderAccount.substring(
			0,
			4,
		)}...
		${acceptingBid?.bid.bidderAccount.substring(
			acceptingBid?.bid.bidderAccount.length - 4,
		)}`;
		const acceptingBidAmountWild = `${Number(
			acceptingBid?.bid.amount,
		).toLocaleString()} ${WILD_CURRENCY_CODE}`;
		return (
			<>
				{!isAccepting && (
					<div
						className={styles.Section}
						style={{
							display: 'flex',
							flexDirection: 'row',
							padding: '0',
						}}
					>
						{nft()}
						{details()}
					</div>
				)}
				<div
					className={styles.Section}
					style={{
						display: 'flex',
						flexDirection: 'column',
						textAlign: 'center',
						marginBottom: '8px',
					}}
				>
					{currentHighestBid && (
						<div style={{ margin: '0 8px 8px 8px' }}>
							<p style={{ lineHeight: '24px', paddingBottom: '0' }}>
								{CONFIRM_BID_AMOUNT}
								<br /> <b>{acceptingBidAmountWild}</b> (
								{toFiat(Number(acceptingBidUSD))} {USD_CURRENCY_CODE}) and
								transfer ownership of <b>0://{acceptingBid?.domain?.name}</b> to{' '}
								<b>{truncatedAccountAddress}</b>?
							</p>
						</div>
					)}

					{errorMessage}

					{!isAccepting && (
						<div className={styles.CTAContainer}>
							<div style={{ paddingTop: '8px' }}>
								<FutureButton
									glow
									alt
									style={{
										height: 36,
										width: 140,
										borderRadius: 18,
										textTransform: 'uppercase',
										margin: '16px auto 0 auto',
									}}
									onClick={closeBid}
								>
									{CANCEL_BTN}
								</FutureButton>
							</div>
							<div style={{ paddingTop: '8px' }}>
								<FutureButton
									glow
									style={{
										height: 36,
										width: 140,
										borderRadius: 18,
										textTransform: 'uppercase',
										margin: '16px auto 0 auto',
									}}
									onClick={acceptBidConfirmed}
								>
									{CONTINUE_BTN}
								</FutureButton>
							</div>
						</div>
					)}
					{isAccepting && (
						<div style={{ marginTop: '40px' }}>{loadingState()}</div>
					)}
				</div>
			</>
		);
	};

	// Wizard Step 3/3 Accepting Fragment
	const bidAcceptedStep = () => {
		const handleClick = () => {
			closeBid();
			setViewingDomain(undefined);
			addNotification(
				`Bid of ${acceptingBid?.bid.amount} WILD for 0://${acceptingBid?.domain.name} accepted. Ownership has been transferred.`,
			);
		};
		return (
			<>
				{!isAccepting && (
					<div
						className={styles.Section}
						style={{
							display: 'flex',
							flexDirection: 'row',
							padding: '0',
						}}
					>
						{nft()}
						{details()}
					</div>
				)}

				{errorMessage}

				{!isAccepting && (
					<>
						<p
							className={styles.SuccessConfirmation}
							style={{
								lineHeight: '24px',
								textAlign: 'center',
								marginTop: '40px',
							}}
						>
							{SUCCESS_CONFIRMATION}
						</p>
						<FutureButton
							glow
							style={{
								height: 36,
								width: 140,
								borderRadius: 18,
								textTransform: 'uppercase',
								margin: '24px auto',
							}}
							onClick={handleClick}
						>
							{FINISH_BTN}
						</FutureButton>
					</>
				)}
				{isAccepting && (
					<div style={{ marginTop: '40px' }}>{loadingState()}</div>
				)}
			</>
		);
	};

	const overlays = () => {
		const isApproveStep = step === Steps.Approve;
		const isConfirmStep = step === Steps.Confirm;
		const isAcceptStep = step === Steps.Accept;
		return (
			<>
				{acceptingBid !== undefined && (
					<Overlay onClose={closeBid} centered open>
						<div
							className={`${styles.Container} border-primary border-rounded blur`}
						>
							{header()}
							<div style={{ margin: '0 8px' }}>
								<StepBar
									step={step + 1}
									steps={['zAuction Check', 'Confirm', 'Accept']}
									onNavigate={(i: number) => setStep(i)}
								/>
							</div>
							{isApproveStep && approveZAuctionStep()}
							{isConfirmStep && confirmStep()}
							{isAcceptStep && bidAcceptedStep()}
						</div>
					</Overlay>
				)}
				{viewingDomain !== undefined && (
					<Overlay onClose={closeDomain} centered open>
						<BidList bids={viewingDomain.bids} onAccept={accept} />
					</Overlay>
				)}
			</>
		);
	};

	return (
		<>
			{overlays()}
			{isTableLoading && (
				<>
					<p className={styles.Message}>{LOADING_DOMAINS_LABEL}</p>
					<Spinner style={{ margin: '8px auto' }} />
				</>
			)}
			<DomainTable
				className={styles.Reset}
				domains={owned}
				isButtonActive={isButtonActive}
				filterOwnBids={true}
				isRootDomain={false}
				ignoreAspectRatios={true}
				rowButtonText={'View Bids'}
				onLoad={tableLoaded}
				onRowButtonClick={viewBid}
				onRowClick={rowClick}
				isGridView={isGridView}
				setIsGridView={(grid: boolean) => setIsGridView(grid)}
				userId={account || undefined}
				style={{ display: isTableLoading ? 'none' : 'inline-block' }}
			/>
		</>
	);
};

export default OwnedDomainTables;
