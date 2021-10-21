//- React Imports
import React, { useMemo } from 'react';

//- Style Imports
import styles from './NFTCard.module.scss';

//- Component Imports
import { ArrowLink, NFTMedia } from 'components';

export interface NFTCardProps {
	actionsComponent?: React.ReactNode;
	children?: React.ReactNode;
	domain: string;
	imageUri?: string;
	name?: string;
	nftMinterId: string;
	nftOwnerId: string;
	onClick?: (event?: any) => void;
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
	onClick,
	price,
	showCreator,
	showOwner,
	style,
}) => {
	// If the domain is super long, truncate it
	let domainText;
	if (('wilder.' + domain).length > 38) {
		domainText = `0://wilder...${
			domain.split('.')[domain.split('.').length - 1]
		}`;
	} else {
		domainText = `0://${domain}`;
	}

	const media = useMemo(() => {
		return (
			<NFTMedia
				className={styles.NFT}
				style={{ height: 348, objectFit: 'contain' }}
				ipfsUrl={imageUri ? imageUri : ''}
				size="medium"
				alt={`NFT preview for ${name}`}
				disableLightbox
			/>
		);
	}, [imageUri, name]);

	return (
		<div
			style={style ? style : {}}
			className={`${styles.NFTCard} border-rounded`}
			onClick={onClick}
		>
			{media}
			<div className={styles.Body}>
				<h5 className={`glow-text-blue`}>{name}</h5>
				<ArrowLink>{domainText}</ArrowLink>
				{/* Need to refactor out actions component */}
				{actionsComponent}
				{children}
			</div>
		</div>
	);
};

export default React.memo(NFTCard);
