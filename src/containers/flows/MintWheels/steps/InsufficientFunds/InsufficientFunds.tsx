// Component Imports
import { FutureButton } from 'components';

// Library Imports
import { EthPerWheel } from '../../helpers';

// Style Imports
import styles from './InsufficientFunds.module.scss';

type InsufficientFundsProps = {
	onDismiss: () => void;
};

const InsufficientFunds = (props: InsufficientFundsProps) => {
	return (
		<section className={styles.Container}>
			<span>
				Insufficient funds. You must have at least <b>{EthPerWheel} WILD</b> in
				your wallet to mint a Crib
			</span>
			<FutureButton glow onClick={props.onDismiss}>
				Dismiss
			</FutureButton>
		</section>
	);
};

export default InsufficientFunds;
