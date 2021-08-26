//- React Imports
import React from 'react';

//- Type Imports
import {
	TokenInformationType,
	TokenDynamicType,
	TokenStakeType,
} from '../types';

//- Style Imports
import styles from '../MintNewNFT.module.css';

//- Asset Imports
import handIcon from './assets/hand.svg';
import storyIcon from './assets/story.svg';
import tickerIcon from './assets/ticker.svg';
import addressIcon from './assets/address.svg';

//- Component Imports
import { FutureButton, Image, LoadingIndicator } from 'components';
import { Maybe } from 'lib/types';

type SummaryProps = {
	token: TokenInformationType | null;
	dynamic?: TokenDynamicType | null;
	staking?: TokenStakeType | null;
	onContinue: () => void;
	isMintLoading: boolean;
	mintingStatusText: string;
	domain: string;
	errorText: string;
};

const Summary: React.FC<SummaryProps> = ({
	token,
	dynamic,
	staking,
	onContinue,
	isMintLoading,
	mintingStatusText,
	domain,
	errorText,
}) => {
	let parentDomain;
	if (domain.substring(1).length > 0) parentDomain = domain.substring(1) + '.';
	else parentDomain = domain.substring(1);

	if (!token) return <></>;

	let errorMessage: Maybe<React.ReactFragment>;

	if (errorText.length > 0 && !isMintLoading) {
		errorMessage = (
			<p style={{ marginTop: '16px' }} className={styles.Error}>
				{`${errorText} Try again later.`}
			</p>
		);
	}

	return (
		<div className={styles.Section}>
			<div className={styles.Summary}>
				<div className={`${styles.NFT} ${styles.Uploaded} border-rounded`}>
					{token.mediaType === 'image' && (
						<img alt="nft preview" src={token.previewImage} />
					)}
					{token.mediaType === 'video' && (
						<video autoPlay src={token.previewImage} />
					)}
				</div>
				<div style={{ marginLeft: 16 }}>
					<h2>Summary</h2>
					<ul>
						<li className={styles.Name}>
							<div className={styles.Icon}>
								<Image alt="name icon" src={tickerIcon} />
							</div>
							{token.name}
						</li>
						<li>
							<div className={styles.Icon}>
								<Image alt="address icon" src={addressIcon} />
							</div>
							0://wilder.{parentDomain}
							{token.domain}
						</li>
						<li style={{ maxHeight: 200, overflowY: 'scroll' }}>
							<div className={styles.Icon}>
								<Image alt="story icon" src={storyIcon} />
							</div>
							<p
								style={{
									padding: 0,
									paddingRight: 12,
									maxHeight: 200,
									overflowY: 'scroll',
								}}
							>
								{token.story}
							</p>
						</li>
						{staking && (
							<li>
								<div className={styles.Icon}>
									<Image alt="stake icon" src={handIcon} />
								</div>
								{staking.amount} {staking.currency}
							</li>
						)}
					</ul>
				</div>
			</div>
			<div
				style={{
					display: 'flex',
					flexDirection: 'column',
					alignItems: 'center',
					marginTop: 80,
				}}
			>
				{!isMintLoading && (
					<FutureButton
						style={{
							margin: '8px auto 0 auto',
							height: 36,
							borderRadius: 18,
							width: 130,
						}}
						onClick={onContinue}
						glow={true}
					>
						MINT
					</FutureButton>
				)}
				{errorMessage}
				{isMintLoading && <LoadingIndicator text={mintingStatusText} />}
			</div>
		</div>
	);
};

export default Summary;
