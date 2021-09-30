// Component Imports
import { FutureButton } from 'components';

// Library Imports
import { EthPerWheel } from '../../helpers';

// Style Imports
import styles from './Finished.module.css';

type FinishedProps = {
	onFinish: () => void;
};

const Finished = (props: FinishedProps) => {
	return (
		<section className={styles.Container}>
			<span>Your Wheels were minted successfully!</span>
			<FutureButton glow onClick={props.onFinish}>
				View My Wheels
			</FutureButton>
		</section>
	);
};

export default Finished;
