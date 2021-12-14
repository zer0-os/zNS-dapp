import { Spinner } from 'components';
import React from 'react';

import styles from './LoadingIndicator.module.scss';

type LoadingIndicatorProps = {
	style?: React.CSSProperties;
	text: string | React.ReactNode;
};

const LoadingIndicator = ({ style, text }: LoadingIndicatorProps) => (
	<div style={style} className={styles.Container}>
		{typeof text === 'string' ? <p>{text}</p> : <>{text}</>}
		<Spinner />
	</div>
);

export default LoadingIndicator;
