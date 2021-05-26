//- React Imports
import React from 'react';

//- Style Imports
import styles from './NFTCard.module.css';

//- Component Imports
import { ArrowLink, Image } from 'components';

//- Library Imports
import { randomName, randomImage } from 'lib/Random';

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
};

const NFTCard: React.FC<NFTCardProps> = ({
	name,
	domain,
	imageUri,
	price,
	nftOwnerId,
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
				style={{ height: 348 }}
				src={imageUri ? imageUri : ''}
			/>
			<div className={styles.Body}>
				{showCreator && (
					<div className={styles.Creator}>
						<div
							style={{ backgroundImage: `url("${randomImage(nftMinterId)}")` }}
						></div>
						<span className={`glow-text-blue`}>{randomName(nftMinterId)}</span>
					</div>
				)}
				<h5 className={`glow-text-blue`}>{name}</h5>
				<ArrowLink>wilder.{domain}</ArrowLink>
				<div className={styles.Foot}>
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
								<span className={`glow-text-blue`}>
									{randomName(nftOwnerId)}
								</span>
							</div>
						</div>
					)}
				</div>
			</div>
		</div>
	);
};

export default NFTCard;
