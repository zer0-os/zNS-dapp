import React, { useMemo } from 'react';
import { isEmpty } from 'lodash';
import classNames from 'classnames/bind';
import styles from './VoteBar.module.scss';

type VoteBarProps = {
	scores?: number[];
};

const DEFAULT_PERCENTAGE_VALUE = {
	value1: 0,
	value2: 0,
};

const cx = classNames.bind(styles);

export const VoteBar: React.FC<VoteBarProps> = ({ scores = [] }) => {
	const pecentage = useMemo(() => {
		if (isEmpty(scores) || scores.length !== 2) return DEFAULT_PERCENTAGE_VALUE;

		const [v1, v2] = scores;

		if (v1 === 0 && v2 === 0) return DEFAULT_PERCENTAGE_VALUE;

		return {
			value1: (v1 * 100) / (v1 + v2),
			value2: (v2 * 100) / (v1 + v2),
		};
	}, [scores]);

	return (
		<div className={styles.Container}>
			<span className={`${styles.ValueLabel} ${styles.ValueLabelLeft}`}>
				{pecentage.value1.toFixed(2)}%
			</span>
			<div
				className={cx(styles.Progressbar, {
					Empty: pecentage.value1 === 0 && pecentage.value2 === 0,
				})}
			>
				<div
					className={`${styles.ProgressbarItem} ${styles.ProgressbarItemLeft}`}
					style={{ width: `${pecentage.value1}%` }}
				></div>
				<div
					className={`${styles.ProgressbarItem} ${styles.ProgressbarItemRight}`}
					style={{ width: `${pecentage.value2}%` }}
				></div>
			</div>
			<span className={`${styles.ValueLabel} ${styles.ValueLabelRight}`}>
				{pecentage.value2.toFixed(2)}%
			</span>
		</div>
	);
};
