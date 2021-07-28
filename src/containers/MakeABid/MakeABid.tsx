//- React Imports
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
//- Web3 Imports
import { useWeb3React } from '@web3-react/core'; // Wallet data
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'; // Wallet data
//- Library Imports
import { Domain, Metadata, Bid } from 'lib/types';
import { randomImage, randomName } from 'lib/Random';
import { useBidProvider } from 'lib/providers/BidProvider';
import { getMetadata } from 'lib/metadata';
import { getRelativeDomainPath } from 'lib/utils/domains';
import { useCurrencyProvider } from 'lib/providers/CurrencyProvider';
import { useZnsContracts } from 'lib/contracts';
import { ethers } from 'ethers';
import { ERC20 } from 'types';
//- Component Imports
import {
	StepBar,
	FutureButton,
	TextButton,
	Image,
	TextInput,
	Member,
} from 'components';

//- Style Imports
import styles from './MakeABid.module.css';

type MakeABidProps = {
	domain: Domain;
	onBid: () => void;
};

enum Steps {
	Bid,
	Approve,
}

const MakeABid: React.FC<MakeABidProps> = ({ domain, onBid }) => {
	//- Bid hooks
	const { getBidsForDomain, placeBid } = useBidProvider();

	// React-router-dom
	const history = useHistory();

	// Wild to usd
	const { wildPriceUsd } = useCurrencyProvider();

	///////////
	// State //
	///////////

	const [step, setStep] = useState<Steps>(Steps.Bid);
	const [bid, setBid] = useState<string>('');
	const [currentHighestBid, setCurrentHighestBid] = useState<Bid | undefined>();
	const [currentHighestBidUsd, setCurrentHighestBidUsd] = useState<
		number | undefined
	>();
	const [domainMetadata, setDomainMetadata] = useState<Metadata | undefined>();
	const [error, setError] = useState('');
	const [wildBalance, setWildBalance] = useState(0);
	const [hasApproveTokenTransfer, setHasApprovedTokenTransfer] = useState(
		false,
	);
	const [isApprovalInProgress, setIsApprovalInProgress] = useState(false);

	// Loading States
	const [hasBidDataLoaded, setHasBidDataLoaded] = useState(false);
	const [isBidPending, setIsBidPending] = useState(false);
	const [isMetamaskWaiting, setIsMetamaskWaiting] = useState(false);

	//- Web3 Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { account, chainId } = walletContext;

	const znsContracts = useZnsContracts()!;
	const zAuctionAddress = znsContracts.zAuction.address;
	const wildContract: ERC20 = znsContracts.wildToken;

	const isBidValid =
		(Number(bid) &&
			Number(bid) <= wildBalance &&
			Number(bid) > 0 &&
			Number(bid) > (currentHighestBid?.amount || 0)) === true;

	///////////////
	// Functions //
	///////////////

	const navigateTo = (domain: string) => {
		const relativeDomain = getRelativeDomainPath(domain);
		history.push(relativeDomain);
	};

	const formSubmit = (event: React.FormEvent) => {
		event.preventDefault();
		continueBid();
	};

	const approveZAuction = async () => {
		try {
			setIsApprovalInProgress(true);
			// @zachary - need to know here when the approval is finished
			const tx = await wildContract.approve(
				zAuctionAddress,
				ethers.constants.MaxUint256,
			);
			await tx.wait();
			setHasApprovedTokenTransfer(true);
			setIsApprovalInProgress(false);
		} catch (e) {
			console.warn('zAuction approval failed');
			setIsApprovalInProgress(false);
		}
	};

	const continueBid = async () => {
		// Validate bid
		if (!Number(bid)) return setError('Invalid bid');
		const bidAmount = Number(bid);
		if (bidAmount <= (currentHighestBid?.amount || 0))
			return setError('Your bid must be higher than the current highest');

		if (bidAmount > wildBalance)
			return setError('You have insufficient WILD to make this bid');

		await checkAllowance();
		setError('');
		setStep(Steps.Approve);
	};

	const makeBid = async () => {
		// Get bid
		if (!Number(bid)) return;
		const bidAmount = Number(bid);

		// Send bid to hook
		setIsMetamaskWaiting(true);
		try {
			const bidSuccess = await placeBid(domain, bidAmount);
			if (bidSuccess === true) {
				navigateTo(domain.name);
				onBid();
			}
		} catch (e) {
			console.warn('Failed to place bid');
		}
		setIsMetamaskWaiting(false);
	};

	const getCurrentHighestBid = async () => {
		// Get highest bid
		const allBids = await getBidsForDomain(domain);
		setHasBidDataLoaded(true);
		if (!allBids || allBids.length === 0) return;
		const max = allBids.reduce(function (prev, current) {
			return prev.amount > current.amount ? prev : current;
		});
		setCurrentHighestBid(max);
		setCurrentHighestBidUsd(max.amount * wildPriceUsd);
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

	const checkAllowance = async () => {
		const allowance = await wildContract.allowance(account!, zAuctionAddress);
		const bidAsWei = ethers.utils.parseEther(bid).toString();
		const needsApproving = allowance.lt(bidAsWei);
		setHasApprovedTokenTransfer(!needsApproving);
	};

	useEffect(() => {
		if (step === Steps.Approve && Number(bid) && !isApprovalInProgress) {
			checkAllowance();
		}
	}, [wildContract, account, step, isApprovalInProgress]);

	useEffect(() => {
		getMetadata(domain.metadata).then((metadata: Metadata | undefined) => {
			if (!metadata) return;
			setDomainMetadata(metadata);
			getCurrentHighestBid();
		});
	}, [domain, wildPriceUsd]);

	/////////////////////
	// React Fragments //
	/////////////////////

	const header = () => (
		<>
			<div className={styles.Header}>
				<h1 className={`glow-text-white`}>Place A Bid</h1>
			</div>
		</>
	);

	const nft = () => (
		<div className={styles.NFT}>
			<Image src={domainMetadata?.image} />
		</div>
	);

	const highestBid = () => (
		<>
			{hasBidDataLoaded && currentHighestBid && (
				<>
					<span className="glow-text-white">
						{/* @todo change dp amount */}
						{currentHighestBid.amount.toFixed(2)} WILD
					</span>{' '}
					{currentHighestBidUsd && (
						<span className="glow-text-white">
							(${currentHighestBidUsd.toFixed(2)} USD)
						</span>
					)}
				</>
			)}
			{hasBidDataLoaded && !currentHighestBid && (
				<>
					<span className="glow-text-white">No bids found</span>
				</>
			)}
			{!hasBidDataLoaded && (
				<>
					<span className="glow-text-white">Loading...</span>
				</>
			)}
		</>
	);

	const details = () => (
		<div className={styles.Details}>
			<h2 className="glow-text-white">{domainMetadata?.title}</h2>
			<span>0://{domain.name}</span>
			<div className={styles.Price}>
				<h3 className="glow-text-blue">Highest Bid</h3>
				{highestBid()}
			</div>
			<Member
				id={currentHighestBid?.bidderAccount || ''}
				name={'not yet implemented'}
				image={'not yet implemented'}
				subtext={'Creator'}
			/>
		</div>
	);

	const estimation = () => {
		const isBidValid = !Number.isNaN(parseInt(bid));
		const bidString = isBidValid
			? Number((parseInt(bid) * wildPriceUsd).toFixed(2)).toLocaleString()
			: '0';

		return (
			<>
				<span className={styles.Estimate}>Approx. ${bidString} USD</span>
			</>
		);
	};

	const bidStep = () => (
		<>
			<div
				className={styles.Section}
				style={{ display: 'flex', padding: '0 37.5px' }}
			>
				{nft()}
				{details()}
			</div>
			<div className={styles.InputWrapper}>
				{wildBalance > (currentHighestBid?.amount || 0) && (
					<>
						<p className="glow-text-blue">Enter the amount you wish to bid:</p>
						<span style={{ marginBottom: 8 }} className={styles.Estimate}>
							Your Balance: {Number(wildBalance).toLocaleString()} WILD
						</span>
						<form onSubmit={formSubmit}>
							<TextInput
								onChange={(text: string) => setBid(text)}
								placeholder="Bid amount (WILD)"
								error={error.length > 0}
								errorText={error}
								numeric
								text={bid}
								style={{ width: 268, margin: '0 auto' }}
							/>
						</form>
						{estimation()}
						<FutureButton
							style={{
								height: 36,
								borderRadius: 18,
								textTransform: 'uppercase',
								margin: '32px auto 0 auto',
							}}
							loading={isBidPending}
							onClick={continueBid}
							glow={isBidValid}
						>
							Continue
						</FutureButton>
					</>
				)}
				{wildBalance <= (currentHighestBid?.amount || 0) && (
					<>
						<p className={styles.Error}>
							You don't have enough WILD to bid on this NFT
						</p>
						<span className={styles.Estimate}>
							Your Balance: {Number(wildBalance).toLocaleString()} WILD
						</span>
					</>
				)}
			</div>
		</>
	);

	const approveStep = () => {
		return (
			<div
				className={styles.Section}
				style={{
					display: 'flex',
					flexDirection: 'column',
					padding: '0 37.5px',
				}}
			>
				{!isMetamaskWaiting && !isApprovalInProgress && (
					<>
						{!hasApproveTokenTransfer && (
							<>
								<p style={{ lineHeight: '21px' }}>
									Before placing bids, you need to approve zAuction to access
									your WILD tokens in case your bid is accepted.
								</p>
								<FutureButton
									glow
									alt
									style={{
										height: 36,
										borderRadius: 18,
										textTransform: 'uppercase',
										margin: '16px auto 0 auto',
									}}
									onClick={approveZAuction}
								>
									Approve zAuction
								</FutureButton>
							</>
						)}
						{hasApproveTokenTransfer && (
							<>
								<p>
									zAuction is approved to access your WILD tokens should your
									bid be accepted.
								</p>
								<FutureButton
									glow
									style={{
										height: 36,
										borderRadius: 18,
										textTransform: 'uppercase',
										margin: '16px auto 0 auto',
									}}
									onClick={makeBid}
								>
									Place Bid
								</FutureButton>
							</>
						)}
					</>
				)}
				{isMetamaskWaiting && (
					<>
						<div className={styles.Loading}>
							<div className={styles.Spinner}></div>
						</div>
						<p className={styles.Wait}>Hold tight while we process your bid</p>
					</>
				)}
				{isApprovalInProgress && (
					<>
						<div className={styles.Loading}>
							<div className={styles.Spinner}></div>
						</div>
						<p className={styles.Wait}>zAuction approval in progress</p>
					</>
				)}
			</div>
		);
	};

	return (
		<div className={`${styles.Container} border-primary border-rounded blur`}>
			{header()}
			<StepBar
				step={step + 1}
				steps={['Place A Bid', 'Approve zAuction']}
				onNavigate={(i: number) => setStep(i)}
			/>
			{step === Steps.Bid && bidStep()}
			{step === Steps.Approve && approveStep()}
		</div>
	);
};

export default MakeABid;
