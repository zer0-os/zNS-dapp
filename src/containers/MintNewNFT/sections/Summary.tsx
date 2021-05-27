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

//- Component Imports
import { FutureButton } from 'components';

type SummaryProps = {
	token: TokenInformationType | null;
	dynamic: TokenDynamicType | null;
	staking: TokenStakeType | null;
	onContinue: () => void;
};

const Summary: React.FC<SummaryProps> = ({
	token,
	dynamic,
	staking,
	onContinue,
}) => {
	if (!token || !staking) return <></>;

	return (
		<div className={styles.Section}>
			<div className={styles.Summary}>
				<div className={`${styles.NFT} border-rounded border-blue`}>
					<img src={token.previewImage} />
				</div>
				<div style={{ marginLeft: 16 }}>
					<h2>Summary</h2>
					<ul>
						<li className={styles.Name}>{token.name}</li>
						<li>{token.domain}</li>
						<li>{token.story}</li>
						<li>
							{staking.stake}{' '}
							<span style={{ fontWeight: 700 }}>{staking.currency}</span>
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
					glow
				>
					MINT
				</FutureButton>
			</div>
		</div>
	);
};

export default Summary;
