// Component Imports
import { FutureButton } from 'components';

// Library Imports

// Style Imports
import styles from './InsufficientFunds.module.scss';

type InsufficientFundsProps = {
	onDismiss: () => void;
	pricePerNFT: number;
};

const InsufficientFunds = (props: InsufficientFundsProps) => {
	return (
		<section className={styles.Container}>
			<span>
				Insufficient funds. You must have at least{' '}
				<b>{props.pricePerNFT} ETH</b> in your wallet to mint Pets
			</span>
			<FutureButton glow onClick={props.onDismiss}>
				Dismiss
			</FutureButton>
		</section>
	);
};

export default InsufficientFunds;
