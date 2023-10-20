import React from 'react';

import styles from './ToggleSection.module.scss';

import arrow from './assets/arrow.svg';

const ToggleSection = (props) => {
	// TODO: Animate toggle sections

	const rotateCss = {
		transform: props.open ? 'rotate(90deg)' : 'rotate(0deg)',
	};

	return (
		<div style={props.style} className={styles.ToggleSection}>
			<div className={styles.Header}>
				<img alt="toggle arrow" src={arrow} style={rotateCss} />
				<span className={`no-select`}>{props.label}</span>
			</div>
			<div
				className={`${styles.Content} ${
					props.open ? styles.Open : styles.Closed
				}`}
			>
				{props.children}
			</div>
		</div>
	);
};

export default ToggleSection;
