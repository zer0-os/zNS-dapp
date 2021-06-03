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
import { FutureButton } from 'components';

type SummaryProps = {
	token: TokenInformationType | null;
	dynamic?: TokenDynamicType | null;
	staking?: TokenStakeType | null;
	onContinue: () => void;
	isMintLoading: boolean;
	domain: string;
};

const Summary: React.FC<SummaryProps> = ({
	token,
	dynamic,
	staking,
	onContinue,
	isMintLoading,
	domain,
}) => {
	if (!token) return <></>;

	return (
		<div className={styles.Section}>
			<div className={styles.Summary}>
				<div className={`${styles.NFT} border-rounded border-blue`}>
					<img alt="nft preview" src={token.previewImage} />
				</div>
				<div style={{ marginLeft: 16 }}>
					<h2>Summary</h2>
					<ul>
						<li className={styles.Name}>
							<img alt="name icon" src={tickerIcon} />
							{token.name}
						</li>
						<li>
							<img alt="address icon" src={addressIcon} />
							0://wilder.{domain.substring(1)}.{token.domain}
						</li>
						<li>
							<img alt="story icon" src={storyIcon} />
							{token.story}
						</li>
						{staking && (
							<li>
								<img alt="stake icon" src={handIcon} />
								{staking.stake} {staking.currency}
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
				{isMintLoading && (
					<p style={{ fontWeight: 700 }}>
						Things are working behind the scenes - please wait
					</p>
				)}
				<FutureButton
					style={{
						margin: '8px auto 0 auto',
						height: 36,
						borderRadius: 18,
						width: 130,
					}}
					onClick={onContinue}
					loading={isMintLoading}
					glow={true}
				>
					MINT
				</FutureButton>
			</div>
		</div>
	);
};

export default Summary;
