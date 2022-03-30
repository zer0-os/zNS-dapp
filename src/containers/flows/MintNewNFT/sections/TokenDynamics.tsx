//- React Imports
import React, { useState } from 'react';

//- Type Imports
import { TokenDynamicType } from '../types';

//- Style Imports
import styles from '../MintNewNFT.module.scss';

//- Component Imports
import { ToggleButton, TextInput, FutureButton } from 'components';

type TokenDynamicsProps = {
	token: TokenDynamicType | null;
	onContinue: (data: TokenDynamicType) => void;
	onBack: () => void;
};

const TokenDynamics: React.FC<TokenDynamicsProps> = ({ token, onContinue }) => {
	const [dynamic, setDynamic] = useState(token ? token.dynamic : false);
	const [ticker, setTicker] = useState(token ? token.ticker : '');
	const [errors, setErrors] = useState<string[]>([]);

	const pressContinue = () => {
		if (!ticker.length || ticker.length > 4) return setErrors(['ticker']);
		onContinue({
			dynamic: dynamic,
			ticker: ticker,
		});
	};

	return (
		<div
			className={styles.Section}
			style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
		>
			<p style={{ fontSize: 18, lineHeight: 1.3 }}>
				Tokens in Wilder can be valued on the market automatically using a
				bonding curve. This allows them to be bought and sold instantly, like
				trading a currency. If you’re not sure about this option, leave it set
				to “Default”
			</p>
			<ToggleButton
				toggled={dynamic}
				onClick={() => setDynamic(!dynamic)}
				// labels={['Default', 'Dynamic']}
				style={{ marginTop: 9 }}
			/>
			<TextInput
				placeholder={'Ticker'}
				onChange={(ticker: string) =>
					setTicker(
						ticker.length < 4
							? ticker.toUpperCase()
							: ticker.toUpperCase().substring(0, 4),
					)
				}
				text={ticker}
				style={{ width: 216, marginTop: 24 }}
				error={errors.includes('ticker')}
				alphanumeric
			/>
			<div
				style={{ display: 'flex', justifyContent: 'center', marginTop: 128 }}
			>
				<FutureButton
					style={{
						margin: '0 auto 0 auto',
						height: 36,
						borderRadius: 18,
						marginLeft: 48,
						width: 130,
					}}
					onClick={pressContinue}
					glow
				>
					Continue
				</FutureButton>
			</div>
		</div>
	);
};

export default TokenDynamics;
