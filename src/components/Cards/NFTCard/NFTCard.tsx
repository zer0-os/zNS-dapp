//- React Imports
import React from 'react';

//- Style Imports
import styles from './NFTCard.module.css';

//- Component Imports
import { ArrowLink, Image, NFTMedia } from 'components';
import LazyLoad from 'react-lazyload';

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
			<LazyLoad throttle={200} height={348}>
				<img src="https://res.cloudinary.com/fact0ry/video/upload/c_fit,h_500,w_500/v1/zns/QmNeJfSMhxKYgKMDahyGRdf29EgoLBYVYFuZiQeENV3Doj.jpg" />
			</LazyLoad>
			<div className={styles.Body}>
				<h5 className={`glow-text-blue`}>{name}</h5>
				<ArrowLink>{domainText}</ArrowLink>
				{actionsComponent}
			</div>
		</div>
	);
};

export default NFTCard;
