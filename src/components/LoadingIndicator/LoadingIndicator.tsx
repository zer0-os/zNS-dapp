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
			<p>{props.text}</p>
			{props.subtext && (
				<>
					<br />
					<p>{props.subtext}</p>
				</>
			)}
			<Spinner />
		</div>
	);
};

export default LoadingIndicator;
