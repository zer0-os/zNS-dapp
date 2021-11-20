//- React Imports
import React, { useMemo } from 'react';

//- Style Imports
import classNames from 'classnames/bind';
import styles from './NFTCard.module.scss';

//- Component Imports
import { ArrowLink, NFTMedia } from 'components';

export interface NFTCardProps {
	actionsComponent?: React.ReactNode;
	children?: React.ReactNode;
	className?: string;
	domain: string;
	ignoreAspectRatio?: boolean;
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

const cx = classNames.bind(styles);

const NFTCard: React.FC<NFTCardProps> = ({
	actionsComponent,
	children,
	className,
	domain,
	ignoreAspectRatio,
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
	// Some hardcoded values for aspect ratios
	// This will need to be extended
	const isRootDomain = domain.split('.').length <= 2;
	const isSquare = domain.includes('.kicks') && !isRootDomain;
	const isLandscape =
		domain.includes('.wheels') || domain.includes('.concept') || isRootDomain;
	const isPortrait = domain.includes('.WoW') && !isRootDomain;
	const hasAspectRatio =
		!ignoreAspectRatio && (isSquare || isLandscape || isPortrait);

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
				ipfsUrl={imageUri ? imageUri : ''}
				style={{ height: hasAspectRatio ? 'auto' : 348 }}
				size="medium"
				alt={`NFT preview for ${name}`}
				disableLightbox
				fit={!hasAspectRatio ? 'cover' : undefined}
			/>
		);
	}, [imageUri, name, hasAspectRatio]);

	return (
		<div
			style={style ? style : {}}
			className={cx(className, 'border-rounded', {
				NFTCard: true,
				HasAspectRatio: hasAspectRatio,
				'Ratio1-1': hasAspectRatio && isSquare,
				'Ratio16-9': hasAspectRatio && isLandscape,
				'Ratio4-5': hasAspectRatio && isPortrait,
			})}
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
