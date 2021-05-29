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
import graphIcon from './assets/graph.svg';
import handIcon from './assets/hand.svg';
import storyIcon from './assets/story.svg';
import tickerIcon from './assets/ticker.svg';
import addressIcon from './assets/address.svg';

//- Component Imports
import { FutureButton } from 'components';

type SummaryProps = {
	token: TokenInformationType | null;
	dynamic: TokenDynamicType | null;
	staking: TokenStakeType | null;
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
	if (!token || !staking) return <></>;

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
							<img src={tickerIcon} />
							{token.name}
						</li>
						<li>
							<img src={addressIcon} />
							wilder.{domain.substring(1)}.{token.domain}
						</li>
						<li>
							<img src={storyIcon} />
							{token.story}
						</li>
						<li>
							<img src={handIcon} />
							{staking.stake} {staking.currency}
						</li>
					</ul>
				</div>
			</div>
			<div style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }}>
				<FutureButton
					style={{
						margin: '0 auto 0 auto',
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
