//- React imports
import React from 'react';

//- Style Imports
import styles from './HorizontalScroll.module.css';

type HorizontalScrollProps = {
	style?: React.CSSProperties;
	className?: string;
	children: React.ReactNode;
	fade: boolean;
};

const HorizontalScroll: React.FC<HorizontalScrollProps> = ({
	style,
	className,
	children,
	fade,
}) => {
	return (
		<div
			style={style}
			className={`${className ? className : ''} ${styles.bar} ${
				fade ? styles.Fade : ''
			}`}
		>
			{children}
		</div>
	);
};

export default HorizontalScroll;
