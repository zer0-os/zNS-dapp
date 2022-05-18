import React from 'react';
import styles from './VoteBar.module.scss';

type VoteBarProps = {
	value1: number;
	value2: number;
};

export const VoteBar: React.FC<VoteBarProps> = ({ value1, value2 }) => {
	if (value1 < 0 || value2 < 0 || (value1 === 0 && value2 === 0)) return <></>;

	const percentage1 = (value1 * 100) / (value1 + value2);
	const percentage2 = 100 - value1;

	return (
		<div className={styles.Container}>
			<span className={`${styles.ValueLabel} ${styles.ValueLabelLeft}`}>
				{percentage1}%
			</span>
			<div className={styles.Progressbar}>
				<div
					className={`${styles.ProgressbarItem} ${styles.ProgressbarItemLeft}`}
					style={{ width: `${percentage1}%` }}
				></div>
				<div
					className={`${styles.ProgressbarItem} ${styles.ProgressbarItemRight}`}
					style={{ width: `${percentage2}%` }}
				></div>
			</div>
			<span className={`${styles.ValueLabel} ${styles.ValueLabelRight}`}>
				{percentage2}%
			</span>
		</div>
	);
};
