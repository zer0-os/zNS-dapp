// React Imports
import React, { useState } from 'react';

// Style Imports
import classNames from 'classnames/bind';
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

const cx = classNames.bind(styles);

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
		if (!glow) return;
		else if (!hasHovered) setHovered(true);
	};

	const handleClick = () => {
		if (loading) return;
		if (onClick) onClick();
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
			style={style}
		>
			<div className={styles.Content}>
				{!loading && children}
				{loading && <div className={styles.Spinner}></div>}
			</div>
			<div className={washClasses}></div>
		</button>
	);
};

export default FutureButton;
