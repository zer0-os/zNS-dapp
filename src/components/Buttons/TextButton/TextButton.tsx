import React, { useState } from 'react';

import styles from './TextButton.module.scss';

export const TEST_ID = {
	BUTTON: 'text-button',
};
type TextButtonProps = {
	className?: string;
	onClick?: () => any | void;
	style?: React.CSSProperties;
	toggleable?: boolean;
	selected?: boolean;
	children?: React.ReactNode;
};
const TextButton: React.FC<TextButtonProps> = ({
	className,
	onClick,
	style,
	toggleable,
	selected,
	children,
}) => {
	const [isSelected, setIsSelected] = useState(false);

	const handleClick = () => {
		setIsSelected(!isSelected);
		if (onClick) onClick();
	};

	return (
		<button
			onClick={handleClick}
			className={`${styles.textButton} ${
				(toggleable && isSelected) || selected ? styles.selected : ''
			} ${className || ''}`}
			style={style}
			data-testid={TEST_ID.BUTTON}
		>
			{children}
		</button>
	);
};

export default TextButton;
