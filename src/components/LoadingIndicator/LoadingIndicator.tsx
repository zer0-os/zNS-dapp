import { Spinner } from 'components';

import styles from './LoadingIndicator.module.css';

type LoadingIndicatorProps = {
	text: string;
};

const LoadingIndicator = (props: LoadingIndicatorProps) => {
	return (
		<div className={styles.Container}>
			<p>{props.text}</p>
			<Spinner />
		</div>
	);
};

export default LoadingIndicator;
