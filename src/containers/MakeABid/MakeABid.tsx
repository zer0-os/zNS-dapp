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
import { getRelativeDomainPath } from 'lib/domains';
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
	onBid: (bid: Bid) => void;
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
	const [hasBidDataLoaded, setHasBidDataLoaded] = useState(false);
	const [isBidPending, setIsBidPending] = useState(false);
	const [domainMetadata, setDomainMetadata] = useState<Metadata | undefined>();
	const [error, setError] = useState('');
	const [wildBalance, setWildBalance] = useState(0);

	//- Web3 Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { account, chainId } = walletContext;

	// @zachary balance here
	const wildContract: ERC20 = useZnsContracts()!.wildToken;
	const getBalance = wildContract.balanceOf(account!)
		.then(function (balanceWei) {
			const stringWei = ethers.utils.formatEther(balanceWei);
			setWildBalance(parseInt(stringWei,10))
		});

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

	const approveZAuction = () => {
		// @zachary zAuction approval here
		console.log('Approve zAuction');
	};

	const continueBid = () => {
		// Validate bid
		if (!Number(bid) || !currentHighestBid) return setError('Invalid bid');
		const bidAmount = Number(bid);
		if (bidAmount <= currentHighestBid.amount)
			return setError('Your bid must be higher than the current highest');

		if (bidAmount > wildBalance)
			return setError('You have insufficient WILD to make this bid');

		setError('');

		setStep(Steps.Approve);
	};

	const makeBid = async () => {
		// Get bid
		if (!Number(bid) || !currentHighestBid) return;
		const bidAmount = Number(bid);

		// Send bid to hook
		setIsBidPending(true);
		const bidData = await placeBid(domain, bidAmount);

		// When bid transaction finished
		setIsBidPending(false);
		if (bidData) {
			navigateTo(domain.name);
			onBid(bidData);
		}
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
				id={'53215321632163216321'}
				name={randomName('63216321632163216')}
				image={randomImage('3216321632163216312')}
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
						<TextInput
							onChange={(text: string) => setBid(text)}
							placeholder="Bid amount (WILD)"
							error={error.length > 0}
							errorText={error}
							numeric
							text={bid}
							style={{ width: 268, margin: '0 auto' }}
						/>
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
				<p style={{ lineHeight: '21px' }}>
					Before placing bids, you need to allow zAuction to perform
					transactions through your wallet. At this stage, we can't check if you
					have already approved or not. If you haven't previously approved
					zAuction, please use the button below. If you have, just hit
					'Continue'.
				</p>
				<FutureButton
					glow
					alt
					style={{
						height: 36,
						borderRadius: 18,
						textTransform: 'uppercase',
						margin: '48px auto 0 auto',
					}}
					onClick={approveZAuction}
				>
					Approve zAuction
				</FutureButton>
				<FutureButton
					glow
					style={{
						height: 36,
						borderRadius: 18,
						textTransform: 'uppercase',
						margin: '48px auto 0 auto',
					}}
					onClick={makeBid}
				>
					Place Bid
				</FutureButton>
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
