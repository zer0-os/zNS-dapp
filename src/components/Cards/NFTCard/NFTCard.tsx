//- React Imports
import React from 'react';

//- Style Imports
import styles from './NFTCard.module.css';

//- Component Imports
import { ArrowLink, Image } from 'components';

export interface NFTCardProps {
	actionsComponent?: React.ReactNode;
	children?: React.ReactNode;
	domain: string;
	imageUri?: string;
	name?: string;
	nftMinterId: string;
	nftOwnerId: string;
	price?: number;
	showCreator?: boolean;
	showOwner?: boolean;
	style?: React.CSSProperties;
}

const NFTCard: React.FC<NFTCardProps> = ({
	actionsComponent,
	children,
	domain,
	imageUri,
	name,
	nftMinterId,
	nftOwnerId,
	price,
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
				{actionsComponent}
			</div>
		</div>
	);
};

export default NFTCard;
