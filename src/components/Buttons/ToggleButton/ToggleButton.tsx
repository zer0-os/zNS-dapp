//- React Imports
import React from 'react';

//- Style Imports
import styles from './ToggleButton.module.scss';

type ToggleButtonProps = {
	hideOnOffLabels?: boolean;
	label?: string | React.ReactNode;
	onClick: () => void;
	style?: React.CSSProperties;
	toggled: boolean;
};

const ToggleButton: React.FC<ToggleButtonProps> = ({
	hideOnOffLabels,
	label,
	onClick,
	style,
	toggled,
}) => (
	<div style={style} className={styles.Container}>
		<div
			onClick={onClick}
			className={`${styles.Toggle} ${toggled ? styles.On : ''}`}
		>
			<div className="no-select">
				{hideOnOffLabels !== true && (
					<>
						<span>On</span>
						<span>Off</span>
					</>
				)}
			</div>
		</div>
		{typeof label === 'string' ? (
			<span className={styles.Label}>{label}</span>
		) : (
			{ label }
		)}
	</div>
);

export default ToggleButton;
