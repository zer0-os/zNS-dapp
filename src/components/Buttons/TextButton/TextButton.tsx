import React, { useState } from 'react';
import styles from './TextButton.module.scss';
import classNames from 'classnames/bind';

export const TEST_ID = {
	BUTTON: 'text-button',
};

const cx = classNames.bind(styles);

type TextButtonProps = {
	children?: React.ReactNode;
	className?: string;
	disabled?: boolean;
	onClick?: () => any | void;
	selected?: boolean;
	style?: React.CSSProperties;
	toggleable?: boolean;
};

const TextButton: React.FC<TextButtonProps> = ({
	children,
	className,
	disabled,
	onClick,
	selected,
	style,
	toggleable,
}) => {
	const [isSelected, setIsSelected] = useState(false);

	const handleClick = () => {
		setIsSelected(!isSelected);
		if (onClick) onClick();
	};

	return (
		<button
			onClick={handleClick}
			className={cx(className, styles.TextButton, {
				Selected: (toggleable && isSelected) || selected,
				Disabled: disabled,
			})}
			style={style}
			data-testid={TEST_ID.BUTTON}
		>
			{children}
		</button>
	);
};

export default TextButton;
