// Component Imports
import { FutureButton } from 'components';

// Style Imports
import styles from './Finished.module.scss';

type FinishedProps = {
	onFinish: () => void;
};

const Finished = (props: FinishedProps) => {
	return (
		<section className={styles.Container}>
			<span>Your Cribs were minted successfully!</span>
			<FutureButton glow onClick={props.onFinish}>
				View My Cribs
			</FutureButton>
		</section>
	);
};

export default Finished;
