import { Spinner } from 'components';

import styles from './LoadingIndicator.module.scss';
import classNames from 'classnames';

type LoadingIndicatorProps = {
	className?: string;
	style?: React.CSSProperties;
	text: string | React.ReactNode;
};

const LoadingIndicator = ({
	className,
	style,
	text,
}: LoadingIndicatorProps) => {
	return (
		<div style={style} className={classNames(styles.Container, className)}>
			<Spinner />
			<p>{text}</p>
		</div>
	);
};

export default LoadingIndicator;
