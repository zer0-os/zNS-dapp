import { Spinner } from 'components';

import styles from './LoadingIndicator.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

type LoadingIndicatorProps = {
	className?: string;
	text: string | React.ReactNode;
	subtext?: string | React.ReactNode;
	style?: React.CSSProperties;
	spinnerPosition?: 'bottom' | 'left';
};

const LoadingIndicator = ({
	className,
	style,
	text,
	subtext,
	spinnerPosition = 'bottom',
}: LoadingIndicatorProps) => {
	return (
		<div
			style={style}
			className={cx(styles.Container, className, {
				Left: spinnerPosition === 'left',
			})}
		>
			{spinnerPosition === 'left' && <Spinner />}
			<div className={styles.TextContainer}>{text}</div>
			{subtext && <div className={styles.SubtextContainer}>{subtext}</div>}
			{spinnerPosition !== 'left' && <Spinner />}
		</div>
	);
};

export default LoadingIndicator;
