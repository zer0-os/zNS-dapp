import React from 'react';

import { ArrowLink } from 'components';

import styles from './StepBar.module.css';

type StepBarProps = {
	step: number;
	steps: string[];
	style?: React.CSSProperties;
	onNavigate?: (i: number) => void;
};

const StepBar: React.FC<StepBarProps> = ({
	step,
	steps,
	style,
	onNavigate,
}) => {
	const translate = () =>
		step >= steps.length
			? (steps.length - 1) * 100 + '%'
			: (step - 1) * 100 + '%';
	const width = () => `${(1 / steps.length) * 100}%`;
	const left = (i: number) => `${(i / steps.length) * 100}%`;

	const goto = (i: number) => {
		if (onNavigate) onNavigate(i);
	};

	const text = (step: string, i: number) =>
		`Step ${i + 1} of ${steps.length}: ${step}`;

	return (
		<div style={style} className={`${styles.StepBar} no-select`}>
			{steps.map((s: string, i: number) => (
				<div
					key={i + s}
					className={`${styles.Placeholder} ${step - 1 > i ? styles.Show : ''}`}
					onClick={() => goto(i)}
					style={{ position: 'absolute', left: left(i), width: width() }}
				>
					<ArrowLink back>{text(s, i)}</ArrowLink>
				</div>
			))}
			<div
				style={{
					width: width(),
					transform: `translateX(${translate()})`,
				}}
				className={`${styles.Bar} ${step > steps.length ? styles.Hide : ''}`}
				data-text={`Step ${step > steps.length ? steps.length : step} of ${
					steps.length
				}: ${steps[step - 1] || steps[steps.length - 1]}`}
			></div>
		</div>
	);
};

export default StepBar;
