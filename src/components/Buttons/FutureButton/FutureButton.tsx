import React, { useState } from 'react';

import styles from './FutureButtonStyle.module.css';

type FutureButtonProps = {
	className?: string;
	onClick?: (event?: any) => void;
	style?: React.CSSProperties;
	toggleable?: boolean;
	children: React.ReactNode;
	glow?: boolean;
	loading?: boolean;
	alt?: boolean;
};

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
}) => {
	const [hasHovered, setHovered] = useState(false);
	const [isSelected, setSelected] = useState(false);

	const handleHover = () => {
		if (!hasHovered) setHovered(true);
	};

	const handleClick = (event: any) => {
		if (loading) return;
		if (onClick) onClick(event);
		if (toggleable) setSelected(!isSelected);
	};

	return (
		<button
			className={`${styles.futureButton} ${isSelected ? styles.selected : ''} ${
				glow ? styles.glow : ''
			} ${loading ? styles.Loading : ''} ${alt ? styles.Alt : ''} ${
				className ? className : ''
			}`}
			onMouseEnter={handleHover}
			onMouseUp={handleClick}
			style={style}
			data-testid={TEST_ID.CONTAINER}
		>
			<div className={styles.content}>
				{!loading && children}
				{loading && (
					<div className={styles.Spinner} data-testid={TEST_ID.LOADER}></div>
				)}
			</div>
			<div
				className={`${styles.wash} ${
					hasHovered && !isSelected ? styles.hovered : ''
				}`}
				data-testid={TEST_ID.WASH}
			></div>
		</button>
	);
};

export default FutureButton;
