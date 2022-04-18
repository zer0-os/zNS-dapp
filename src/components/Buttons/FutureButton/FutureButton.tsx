// React Imports
import React, { useState } from 'react';

import styles from './FutureButtonStyle.module.scss';
// Style Imports
import classNames from 'classnames/bind';
import { Spinner } from 'components';

type FutureButtonProps = {
	className?: string;
	onClick?: (event?: any) => void;
	style?: React.CSSProperties;
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
	children,
	glow,
	loading,
	alt,
	disabled = false,
}) => {
	const [hasHovered, setHovered] = useState(false);

	const handleHover = () => {
		if (!glow) return;
		else if (!hasHovered) setHovered(true);
	};

	const handleClick = (event: any) => {
		if (loading || disabled) return;
		if (onClick) onClick(event);
	};

	const buttonClasses = cx(className, styles.Container, {
		Glow: glow,
		Loading: loading,
		Alt: alt,
		Disabled: disabled,
	});

	const washClasses = cx(styles.Wash, {
		Hovered: hasHovered,
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
					<Spinner className={styles.Spinner} data-testid={TEST_ID.LOADER} />
				)}
			</div>
			<div className={washClasses} data-testid={TEST_ID.WASH}></div>
		</button>
	);
};

export default FutureButton;
