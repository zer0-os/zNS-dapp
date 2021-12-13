import { Spinner } from 'components';
import React from 'react';

import styles from './LoadingIndicator.module.scss';

type LoadingIndicatorProps = {
	style?: React.CSSProperties;
	text: string | React.ReactNode;
};

const LoadingIndicator = (props: LoadingIndicatorProps) => (
	<div style={props.style} className={styles.Container}>
		<p>{props.text}</p>
		<Spinner />
	</div>
);

export default LoadingIndicator;
