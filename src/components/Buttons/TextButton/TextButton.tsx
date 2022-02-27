import React, { useState } from 'react';

import styles from './TextButton.module.scss';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

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
	disabled?: boolean;
};
const TextButton: React.FC<TextButtonProps> = ({
	className,
	onClick,
	style,
	toggleable,
	selected,
	children,
	disabled,
}) => {
	const [isSelected, setIsSelected] = useState(false);

	const handleClick = () => {
		setIsSelected(!isSelected);
		if (onClick) onClick();
	};

	return (
		<button
			onClick={handleClick}
			className={cx(className, styles.textButton, {
				selected: (toggleable && isSelected) || selected,
				disabled: disabled,
			})}
			style={style}
			data-testid={TEST_ID.BUTTON}
		>
			{children}
		</button>
	);
};

export default TextButton;
