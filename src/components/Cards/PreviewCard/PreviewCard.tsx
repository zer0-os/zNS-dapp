//- React imports
import React from 'react';

//- Style Imports
import styles from './PreviewCard.module.scss';

//- Component Imports
import { FutureButton, NFTMedia, TextButton } from 'components';
import { Maybe } from 'lib/types';

type PreviewCardProps = {
	preventInteraction?: boolean;
	children?: React.ReactNode;
	creatorId: string;
	description: string;
	disabled: Maybe<boolean>;
	domain: string;
	image: string;
	isLoading: boolean;
	mvpVersion: number;
	name: string;
	onClickImage?: () => void;
	onImageClick?: () => void;
	onMakeBid?: () => void;
	onViewDomain?: () => void;
	ownerId: string;
	style?: React.CSSProperties;
};

export const TEST_IDS = {
	CONTAINER: 'preview-card-container',
	BLOCKER: 'blocker',
	LOADER: 'loader',
	SPINNER: 'spinner',
	PREVIEW_IMAGE: 'preview-image-container',
	ASSET: 'asset',
	INFO_CONTAINER: 'info-container',
	BUY_CONTAINER: 'buy-container',
	BODY_COMPONENT: 'body-container',
	BODY_COMPONENT_TITLE: 'body-component-title',
	BODY_COMPONENT_DESCRIPTION: 'body-component-description',
	FUTURE_BUTTON_CONTAINER: 'buy-description-and-action',
	NFT_MEDIA: 'nft_media',
};

const PreviewCard: React.FC<PreviewCardProps> = ({
	children,
	creatorId,
	description,
	disabled,
	domain,
	image,
	isLoading,
	mvpVersion,
	name,
	onClickImage,
	onImageClick,
	onMakeBid,
	onViewDomain,
	ownerId,
	preventInteraction,
	style,
}) => {
	//////////////////
	// State & Data //
	//////////////////

	///////////////
	// Functions //
	///////////////

	const makeBid = () => {
		if (disabled || !onMakeBid) return;
		onMakeBid();
	};

	const openNftView = () => {
		if (onViewDomain) onViewDomain();
	};

	///////////////
	// Fragments //
	///////////////

	const body = () => (
		<div className={styles.Body} data-testid="body-container">
			<div>
				<h5 className="glow-text-blue" data-testid="body-component-title">
					{name ? name : domain.split('/')[1]}
				</h5>
				<p
					className={styles.Description}
					data-testid="body-component-description"
				>
					{description}
				</p>
			</div>
		</div>
	);

	const buy = () => (
		<div className={styles.Buy} data-testid="buy-container">
			{mvpVersion === 1 && (
				<>
					<TextButton onClick={openNftView} className={styles.ViewLink}>
						View NFT Page
					</TextButton>
				</>
			)}
			{mvpVersion === 3 && (
				<div data-testid="buy-description-and-action">
					<FutureButton
						glow
						onClick={makeBid}
						style={{ height: 36, width: 118, borderRadius: 30 }}
					>
						BUY
					</FutureButton>
					<span className={`glow-text-white`}>
						W1.56 <span className={`glow-text-blue`}>($8,000)</span>
					</span>
					<span className={`glow-text-blue`}>Last Offer</span>
				</div>
			)}
		</div>
	);

	////////////
	// Render //
	////////////

	return (
		<div
			className={styles.PreviewCard}
			style={style || {}}
			data-testid="preview-card-container"
		>
			{preventInteraction && (
				<div className={styles.Blocker} data-testid="blocker"></div>
			)}
			{isLoading && (
				<div className={styles.Loading} data-testid="loader">
					<div className={styles.Spinner} data-testid="spinner"></div>
				</div>
			)}
			<>
				<div
					className={styles.Preview}
					style={{ opacity: isLoading ? 0 : 1 }}
					data-testid="preview-image-container"
				>
					<div
						className={`${styles.Asset} ${
							mvpVersion === 3 ? styles.MVP3Asset : ''
						}`}
						data-testid="asset"
					>
						<NFTMedia
							size="medium"
							className={`${styles.Image} img-border-rounded`}
							alt="NFT Preview"
							ipfsUrl={image}
							data-testid={TEST_IDS.NFT_MEDIA}
						/>
					</div>
					<div className={styles.InfoContainer} data-testid="info-container">
						{body()}
						{buy()}
					</div>
				</div>
				{children && mvpVersion === 3 && (
					<>
						<hr className="glow" style={{ opacity: isLoading ? 0 : 1 }} />
						<div
							className={styles.Children}
							style={{ opacity: isLoading ? 0 : 1 }}
						>
							{children}
						</div>
					</>
				)}
			</>
		</div>
	);
};

export default PreviewCard;
