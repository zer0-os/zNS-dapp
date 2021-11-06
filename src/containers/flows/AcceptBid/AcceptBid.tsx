/* eslint-disable react-hooks/exhaustive-deps */
// React Imports
import React, { useEffect, useState } from 'react';
// Library Imports
import { useBidProvider } from 'lib/providers/BidProvider';
import { toFiat } from 'lib/currency';
import { getMetadata } from 'lib/metadata';
import { useCurrencyProvider } from 'lib/providers/CurrencyProvider';
import useNotification from 'lib/hooks/useNotification';
import { ethers } from 'ethers';
import { ERC20 } from 'types';
// Type Imports
import { Bid, Maybe, Metadata } from 'lib/types';
// Component Imports
import { FutureButton, Member, NFTMedia, Spinner, StepBar } from 'components';
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
	CHECKING_ZAUCTION_STATUS,
} from './constants';
// Utils
import { AcceptBidProps, Steps } from './utils';
// Style Imports
import styles from './AcceptBid.module.scss';

const AcceptBid: React.FC<AcceptBidProps> = ({
	setViewingDomain,
	acceptingBid,
	onClose,
	error,
	setError,
	zAuctionAddress,
	znsContracts,
	ownedQuery,
}) => {
	// Bid hooks
	const { acceptBid, getBidsForDomain } = useBidProvider();
	// Notification Confirmation
	const { addNotification } = useNotification();
	// Wild to usd
	const { wildPriceUsd } = useCurrencyProvider();
	// Wallet Integrations
	const wildContract: ERC20 = znsContracts.wildToken;

	//////////////////
	// State & Data //
	//////////////////

	const [step, setStep] = useState<Steps>(Steps.Approve);
	const [bids, setBids] = useState<Bid[] | undefined>([]);
	const [domainMetadata, setDomainMetadata] = useState<Metadata | undefined>();
	const [statusText, setStatusText] = useState<string>('');
	const [currentHighestBid, setCurrentHighestBid] = useState<Bid | undefined>();
	const [currentHighestBidUsd, setCurrentHighestBidUsd] = useState<
		number | undefined
	>();
	// Loading States
	const [isAccepting, setIsAccepting] = React.useState(false);
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

	const checkZAuctionApproval = async () => {
		setIsCheckingAllowance(true);
		setStatusText(CHECKING_ZAUCTION_STATUS);
		await new Promise((r) => setTimeout(r, 800));
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
			// Get bids for selected domain and return highest
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
				style={{ textAlign: 'center', margin: '12px 0' }}
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
										onClick={onClose}
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
								<br />{' '}
								<b className="glow-text-white">{acceptingBidAmountWild}</b> (
								{toFiat(Number(acceptingBidUSD))} {USD_CURRENCY_CODE}) and
								transfer ownership of{' '}
								<b className="glow-text-white">
									0://{acceptingBid?.domain?.name}
								</b>{' '}
								to <b className="glow-text-white">{truncatedAccountAddress}</b>?
							</p>
						</div>
					)}
					{error && <div style={{ paddingTop: '12px' }}>{errorMessage}</div>}
					{!isAccepting && (
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
									onClick={onClose}
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
			onClose();
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

	const isApproveStep = step === Steps.Approve;
	const isConfirmStep = step === Steps.Confirm;
	const isAcceptStep = step === Steps.Accept;
	return (
		<>
			<div className={`${styles.Container} border-primary border-rounded blur`}>
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
		</>
	);
};

export default AcceptBid;
