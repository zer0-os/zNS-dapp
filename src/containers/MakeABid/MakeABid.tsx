//- React Imports
import React, { useState } from 'react';

//- Library Imports
import { DisplayDomain } from 'lib/types';
import { randomImage, randomName } from 'lib/Random';

//- Component Imports
import { FutureButton, Image, TextInput, Member } from 'components';

//- Style Imports
import styles from './MakeABid.module.css';

type MakeABidProps = {
	domain: any;
	onBid: () => void;
};

const MakeABid: React.FC<MakeABidProps> = ({ domain, onBid }) => {
	///////////
	// State //
	///////////

	const [bid, setBid] = useState<string>('');

	///////////////
	// Functions //
	///////////////

	const makeBid = () => {
		console.log('Making bid for ' + bid + ' WILD');
		if (onBid) onBid();
	};

	// Need to plug into the bid middleware

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
			<Image src={`https://picsum.photos/seed/testing/300/300`} />
		</div>
	);

	const details = () => (
		<div className={styles.Details}>
			<h2 className="glow-text-white">{domain.name}</h2>
			<span>0://wilder.hello</span>

			<div className={styles.Price}>
				<h3 className="glow-text-blue">Highest Bid</h3>
				<span className="glow-text-white">1.56 WILD</span>{' '}
				<span className="glow-text-white">($8000)</span>
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
				onClick={makeBid}
			>
				Place Bid
			</FutureButton>
		</div>
	);
};

export default MakeABid;
