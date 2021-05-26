//- React Imports
import React from 'react';

//- Style Imports
import styles from './ToggleButton.module.css';

type ToggleButtonProps = {
	toggled: boolean;
	style?: React.CSSProperties;
	onClick: () => void;
	labels?: string[];
};

const ToggleButton: React.FC<ToggleButtonProps> = ({
	toggled,
	style,
	onClick,
	labels,
}) => {
	const clickLabel = (left: boolean) => {
		if ((left && toggled) || (!left && !toggled)) onClick();
	};

	return (
		<div style={style} className={styles.Container}>
			{/* Left Label */}
			{labels && labels.length && (
				<span
					title={labels[0]}
					onClick={() => clickLabel(true)}
					className={!toggled ? styles.On : ''}
				>
					{labels[0]}
				</span>
			)}

			{/* Toggle Button */}
			<div
				onClick={onClick}
				className={`${styles.Toggle} ${toggled ? styles.On : ''}`}
			>
				{/* Dot */}
				<div></div>
			</div>

			{/* Right Label */}
			{labels && labels.length > 1 && (
				<span
					title={labels[1]}
					onClick={() => clickLabel(false)}
					className={toggled ? styles.On : ''}
				>
					{labels[1]}
				</span>
			)}
		</div>
	);
};

export default ToggleButton;
