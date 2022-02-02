import { Spinner } from 'components';

import styles from './LoadingIndicator.module.scss';

type LoadingIndicatorProps = {
	style?: React.CSSProperties;
	text: string;
};

const LoadingIndicator = (props: LoadingIndicatorProps) => {
	return (
		<div style={props.style} className={styles.Container}>
			<p>{props.text}</p>
			<Spinner />
		</div>
	);
};

export default LoadingIndicator;
