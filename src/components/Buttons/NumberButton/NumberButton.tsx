//- React Imports
import React from 'react';

//- Style Imports
import styles from './NumberButton.module.css';

type NumberButtonProps = {
	number: number;
	onClick: () => void;
	rotating?: boolean;
	style?: React.CSSProperties;
};

const NumberButton: React.FC<NumberButtonProps> = ({
	number,
	onClick,
	rotating,
	style,
}) => {
	return (
		<button
			style={style}
			onClick={onClick}
			className={`${styles.NumberButton} ${rotating ? styles.Rotating : ''}`}
		>
			{number}
		</button>
	);
};

export default NumberButton;
