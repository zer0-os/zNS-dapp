// React Imports
import React, { useState } from 'react';

import styles from './FutureButtonStyle.module.scss';
// Style Imports
import classNames from 'classnames/bind';

type FutureButtonProps = {
	className?: string;
	onClick?: (event?: any) => void;
	style?: React.CSSProperties;
	toggleable?: boolean;
	children: React.ReactNode;
	glow?: boolean;
	loading?: boolean;
	alt?: boolean;
	disabled?: boolean;
};

const cx = classNames.bind(styles);

export const TEST_ID = {
	CONTAINER: 'future-button-container',
	LOADER: 'future-button-loading-spinner',
	WASH: 'future-button-wash',
};

// @TODO Should make glow the default state since it's much more prevalent in the design
const FutureButton: React.FC<FutureButtonProps> = ({
	className,
	onClick,
	style,
	toggleable,
	children,
	glow,
	loading,
	alt,
	disabled = false,
}) => {
	const [hasHovered, setHovered] = useState(false);
	const [isSelected, setSelected] = useState(false);

	const handleHover = () => {
		if (!glow) return;
		else if (!hasHovered) setHovered(true);
	};

	const handleClick = (event: any) => {
		if (loading || disabled) return;
		if (onClick) onClick(event);
		if (toggleable) setSelected(!isSelected);
	};

	const buttonClasses = cx(className, {
		futureButton: true,
		futureButtonInactive: !glow,
		glow: glow,
		selected: isSelected,
		Loading: loading,
		Alt: alt,
		Disabled: disabled,
	});

	const washClasses = cx({
		wash: true,
		hovered: hasHovered && !isSelected,
	});

	return (
		<button
			className={buttonClasses}
			onMouseEnter={handleHover}
			onMouseUp={handleClick}
			style={style}
			data-testid={TEST_ID.CONTAINER}
			disabled={disabled}
		>
			<div className={styles.Content}>
				{!loading && children}
				{loading && (
					<div className={styles.Spinner} data-testid={TEST_ID.LOADER}></div>
				)}
			</div>
			<div className={washClasses} data-testid={TEST_ID.WASH}></div>
		</button>
	);
};

export default FutureButton;
