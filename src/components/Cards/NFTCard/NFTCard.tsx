//- React Imports
import React from 'react';

//- Style Imports
import styles from './NFTCard.module.css';

//- Component Imports
import { ArrowLink, Image } from 'components';

type NFTCardProps = {
	name: string;
	domain: string;
	imageUri: string;
	price: number;
	nftOwnerId: string;
	nftMinterId: string;
	showCreator?: boolean;
	showOwner?: boolean;
	style?: React.CSSProperties;
	children?: React.ReactNode;
};

const NFTCard: React.FC<NFTCardProps> = ({
	name,
	domain,
	imageUri,
	price,
	nftOwnerId,
	children,
	nftMinterId,
	showCreator,
	showOwner,
	style,
}) => {
	return (
		<div
			style={style ? style : {}}
			className={`${styles.NFTCard} border-rounded`}
		>
			<Image
				className={styles.NFT}
				style={{ height: 348, objectFit: 'contain' }}
				src={imageUri ? imageUri : ''}
			/>
			<div className={styles.Body}>
				{/* {showCreator && (
					<div className={styles.Creator}>
						<div
							style={{ backgroundImage: `url("${randomImage(nftMinterId)}")` }}
						></div>
						<span className={`glow-text-blue`}>{nftMinterId}</span>
					</div>
				)} */}
				<h5 className={`glow-text-blue`}>{name}</h5>
				<ArrowLink>0://{domain}</ArrowLink>
				{/* <div className={styles.Foot}>
					<div>
						<span>Last Traded Price</span>
						<span className={`glow-text-blue`}>
							{Number(price).toLocaleString()} WILD
						</span>
					</div>
					{showOwner && (
						<div>
							<span>Owned By</span>
							<div className={styles.Creator}>
								<div
									style={{
										backgroundImage: `url("${randomImage(nftOwnerId)}")`,
									}}
								></div>
								<span className={`glow-text-blue`}>{nftOwnerId}</span>
							</div>
						</div>
					)}
				</div> */}
				{children}
			</div>
		</div>
	);
};

export default NFTCard;
