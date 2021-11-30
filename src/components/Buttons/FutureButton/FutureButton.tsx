// React Imports
import React, { forwardRef, useState } from 'react';

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
	ref?: React.RefObject<any>;
	onMouseEnter?: (e: React.MouseEvent) => void;
	onMouseLeave?: (e: React.MouseEvent) => void;
	onTouchStart?: (e: React.TouchEvent) => void;
	onTouchMove?: (e: React.TouchEvent) => void;
	onTouchEnd?: (e: React.TouchEvent) => void;
};

const cx = classNames.bind(styles);

export const TEST_ID = {
	CONTAINER: 'future-button-container',
	LOADER: 'future-button-loading-spinner',
	WASH: 'future-button-wash',
};

// @TODO Should make glow the default state since it's much more prevalent in the design
const FutureButton = forwardRef<HTMLButtonElement, FutureButtonProps>(
	(
		{
			className,
			onClick,
			style,
			toggleable,
			children,
			glow,
			loading,
			alt,
			onMouseEnter,
			...rest
		},
		ref,
	) => {
		const [hasHovered, setHovered] = useState(false);
		const [isSelected, setSelected] = useState(false);

		const handleHover = (event: React.MouseEvent) => {
			if (!glow) return;
			else if (!hasHovered) setHovered(true);
			if (onMouseEnter) onMouseEnter(event);
		};

		const handleClick = (event: any) => {
			if (loading) return;
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
				ref={ref}
				style={style}
				data-testid={TEST_ID.CONTAINER}
				{...rest}
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
	},
);

export default FutureButton;
