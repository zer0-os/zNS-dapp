import { Spinner } from 'components';

import styles from './LoadingIndicator.module.scss';
import classNames from 'classnames';

type LoadingIndicatorProps = {
	className?: string;
	text: string | React.ReactNode;
	subtext?: string | React.ReactNode;
	style?: React.CSSProperties;
};

const LoadingIndicator = ({
	className,
	style,
	text,
	subtext,
}: LoadingIndicatorProps) => {
	return (
		<div style={style} className={classNames(styles.Container, className)}>
			<div className={styles.TextContainer}>{text}</div>
			{subtext && <div className={styles.SubtextContainer}>{subtext}</div>}
			<Spinner />
			<p>{text}</p>
		</div>
	);
};

export default LoadingIndicator;
