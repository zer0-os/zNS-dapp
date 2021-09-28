import { FutureButton } from 'components';

import styles from './InsufficientFunds.module.css';

import { EthPerWheel } from '../../helpers';

type InsufficientFundsProps = {
	onDismiss: () => void;
};

const InsufficientFunds = (props: InsufficientFundsProps) => {
	return (
		<section className={styles.Container}>
			<span>
				Insufficient funds. You must have at least <b>{EthPerWheel}ETH</b> in
				your wallet to mint a Wheel
			</span>
			<FutureButton glow onClick={props.onDismiss}>
				Dismiss
			</FutureButton>
		</section>
	);
};

export default InsufficientFunds;
