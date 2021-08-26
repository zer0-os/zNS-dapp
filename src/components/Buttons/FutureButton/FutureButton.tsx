import React, { useState } from 'react';

import styles from './FutureButtonStyle.module.css';

type FutureButtonProps = {
	className?: string;
	onClick: () => void;
	style?: React.CSSProperties;
	toggleable?: boolean;
	children: React.ReactNode;
	glow?: boolean;
	loading?: boolean;
	alt?: boolean;
};

// @TODO Should make glow the default state since it's much more prevalent in the design
// @TODO glow is effectively our "disabled" state here, but we should be more explicit about that
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

	const handleClick = () => {
		if (loading) return;
		if (onClick) onClick();
		if (toggleable) setSelected(!isSelected);
	};

	return (
		<button
			className={`${styles.futureButton} ${isSelected ? styles.selected : ''} ${
				glow ? styles.glow : styles.Disabled
			} ${loading ? styles.Loading : ''} ${alt ? styles.Alt : ''} ${
				className ? className : ''
			}`}
			onMouseEnter={handleHover}
			onMouseUp={handleClick}
			style={style}
		>
			<div className={styles.content}>
				{!loading && children}
				{loading && <div className={styles.Spinner}></div>}
			</div>
			<div
				className={`${styles.wash} ${
					hasHovered && !isSelected ? styles.hovered : ''
				}`}
			></div>
		</button>
	);
};

export default FutureButton;
