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
	// If the domain is super long, truncate it
	let domainText;
	if (domain.length > 38) {
		domainText = `0://wilder...${
			domain.split('.')[domain.split('.').length - 1]
		}`;
	} else {
		domainText = `0://${domain}`;
	}

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
				<h5 className={`glow-text-blue`}>{name}</h5>
				<ArrowLink>{domainText}</ArrowLink>
				{children}
			</div>
		</div>
	);
};

export default NFTCard;
