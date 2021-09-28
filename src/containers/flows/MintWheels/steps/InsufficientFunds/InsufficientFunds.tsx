import { FutureButton } from 'components';

import styles from './InsufficientFunds.module.css';

type InsufficientFundsProps = {
	onDismiss: () => void;
};

const InsufficientFunds = (props: InsufficientFundsProps) => {
	return (
		<section className={styles.Container}>
			<span>
				Insufficient funds. You must have at least 0.07ETH in your wallet to
				mint a Wheel
			</span>
			<FutureButton glow onClick={props.onDismiss}>
				Dismiss
			</FutureButton>
		</section>
	);
};

export default InsufficientFunds;
