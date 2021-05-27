//- React Imports
import React, { useState } from 'react';

//- Type Imports
import { TokenStakeType } from '../types';

//- Style Imports
import styles from '../MintNewNFT.module.css';

//- Component Imports
import { TextInput, FutureButton } from 'components';

type StakingProps = {
	token: TokenStakeType | null;
	onContinue: (data: TokenStakeType) => void;
};

const Staking: React.FC<StakingProps> = ({ token, onContinue }) => {
	const [amount, setAmount] = useState('');
	const [currency, setCurrency] = useState('');
	const [errors, setErrors] = useState<string[]>([]);

	const pressContinue = () => {
		// Validate
		const e: string[] = [];
		if (!amount.length) e.push('amount');
		if (!currency.length) e.push('currency');
		if (e.length) return setErrors(e);
		onContinue({
			stake: parseInt(amount),
			currency: currency,
		});
	};

	return (
		<div
			className={styles.Section}
			style={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}
		>
			<p style={{ fontSize: 18, lineHeight: 1.3 }}>
				In order to reserve space for your token in Wilder, you’ll need to put
				up some capital. You can bid what you think is a reasonable amount; if
				the owner accepts your offer, the transaction will proceed
				automatically. If your offer is rejected, the transaction will be
				cancelled.
			</p>
			<div style={{ margin: '0 auto', position: 'relative' }}>
				<TextInput
					placeholder={'Amount'}
					onChange={(amount: string) => setAmount(amount)}
					text={amount}
					style={{ width: '215px' }}
					error={errors.includes('amount')}
					numeric
				/>
				<span
					style={{
						position: 'absolute',
						top: '50%',
						left: 'calc(100% + 16px)',
						transform: 'translateY(-50%)',
					}}
				>
					WILD
				</span>
			</div>
			<div style={{ display: 'flex', justifyContent: 'center', marginTop: 80 }}>
				<FutureButton
					style={{
						margin: '0 auto 0 auto',
						height: 36,
						borderRadius: 18,
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

export default Staking;
