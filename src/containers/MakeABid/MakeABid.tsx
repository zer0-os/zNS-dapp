//- React Imports
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

//- Library Imports
import { Domain, Metadata, Bid } from 'lib/types';
import { randomImage, randomName } from 'lib/Random';
import { useBidProvider } from 'lib/providers/BidProvider';
import { getMetadata } from 'lib/metadata';
import { wildToUsd } from 'lib/coingecko';
import { getRelativeDomainPath } from 'lib/domains';
import { useCurrencyProvider } from 'lib/providers/CurrencyProvider';

//- Component Imports
import { FutureButton, Image, TextInput, Member } from 'components';

//- Style Imports
import styles from './MakeABid.module.css';

type MakeABidProps = {
	domain: Domain;
	onBid: (bid: Bid) => void;
};

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

	const [bid, setBid] = useState<string>('');
	const [currentHighestBid, setCurrentHighestBid] = useState<Bid | undefined>();
	const [currentHighestBidUsd, setCurrentHighestBidUsd] = useState<
		number | undefined
	>();
	const [hasBidDataLoaded, setHasBidDataLoaded] = useState(false);
	const [isBidPending, setIsBidPending] = useState(false);
	const [domainMetadata, setDomainMetadata] = useState<Metadata | undefined>();

	///////////////
	// Functions //
	///////////////

	const navigateTo = (domain: string) => {
		const relativeDomain = getRelativeDomainPath(domain);
		history.push(relativeDomain);
	};

	const makeBid = async () => {
		if (!Number(bid)) return;
		setIsBidPending(true);
		// @zachary calling the place bid hook here
		const bidData = await placeBid(domain, Number(bid));
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
			<hr className="glow" />
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

		return <span className={styles.Estimate}>${bidString} USD</span>;
	};

	return (
		<div className={`${styles.Container} border-primary border-rounded blur`}>
			{header()}

			<div
				className={styles.Section}
				style={{ display: 'flex', padding: '0 37.5px' }}
			>
				{nft()}
				{details()}
			</div>

			<div className={styles.InputWrapper}>
				<p className="glow-text-blue">Enter the amount you wish to bid:</p>
				<TextInput
					onChange={(text: string) => setBid(text)}
					placeholder="Bid amount (WILD)"
					numeric
					text={bid}
					style={{ width: 268, margin: '0 auto' }}
				/>
				{estimation()}
			</div>

			<FutureButton
				glow
				style={{
					height: 36,
					borderRadius: 18,
					textTransform: 'uppercase',
					margin: '0 auto',
				}}
				loading={isBidPending}
				onClick={makeBid}
			>
				Place Bid
			</FutureButton>
		</div>
	);
};

export default MakeABid;
