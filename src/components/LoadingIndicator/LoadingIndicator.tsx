import { Spinner } from 'components';

import styles from './LoadingIndicator.module.scss';

type LoadingIndicatorProps = {
	text: string | React.ReactNode;
	subtext?: string | React.ReactNode;
	style?: React.CSSProperties;
};

const LoadingIndicator = (props: LoadingIndicatorProps) => {
	return (
		<div style={props.style} className={styles.Container}>
			<div className={styles.TextContainer}>{props.text}</div>
			{props.subtext && (
				<div className={styles.SubtextContainer}>{props.subtext}</div>
			)}
			<Spinner />
		</div>
	);
};

export default LoadingIndicator;
