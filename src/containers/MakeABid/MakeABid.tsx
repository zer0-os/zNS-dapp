//- React Imports
import React, { useState, useEffect } from 'react';

//- Library Imports
import { Domain, Metadata, Bid, Encoded } from 'lib/types';
import { randomImage, randomName } from 'lib/Random';
import { useBidProvider } from 'lib/providers/BidProvider';
import { getMetadata } from 'lib/metadata';
import { wildToUsd } from 'lib/coingecko';

//- Component Imports
import { FutureButton, Image, TextInput, Member } from 'components';

//- Style Imports
import styles from './MakeABid.module.css';

type MakeABidProps = {
	domain: Domain;
	onBid: () => void;
};

const MakeABid: React.FC<MakeABidProps> = ({ domain, onBid }) => {
	const { getBidsForDomain, placeBid } = useBidProvider();

	///////////
	// State //
	///////////

	const [bid, setBid] = useState<string>('');
	const [currentHighestBid, setCurrentHighestBid] = useState<Bid | undefined>();
	const [currentHighestBidUsd, setCurrentHighestBidUsd] = useState<
		number | undefined
	>();
	const [isBidPending, setIsBidPending] = useState(false);
	const [domainMetadata, setDomainMetadata] = useState<Metadata | undefined>();

	///////////////
	// Functions //
	///////////////

	const makeBid = async () => {
		if (!Number(bid)) return;
		setIsBidPending(true);
		// @zachary calling the place bid hook here
		const bidData = await placeBid(domain, Number(bid));
		setIsBidPending(false);
		if (bidData) onBid();
	};

	const getCurrentHighestBid = async () => {
		// Get highest bid
		const allBids = await getBidsForDomain(domain);
		if (!allBids) return;
		const max = allBids.reduce(function (prev, current) {
			return prev.amount > current.amount ? prev : current;
		});
		setCurrentHighestBid(max);

		// USD conversion
		const bidUsd = await wildToUsd(max.amount);
		setCurrentHighestBidUsd(bidUsd);
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
	}, [domain]);

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
			{currentHighestBid && (
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
			{!currentHighestBid && (
				<>
					<span className="glow-text-white">Loading bid data</span>
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
