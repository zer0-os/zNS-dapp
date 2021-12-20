/* eslint-disable react-hooks/exhaustive-deps */
//- React Imports
import React from 'react';

//- Style Imports
import styles from './BannerContainer.module.scss';

type BannerContainerProps = {
	style?: React.CSSProperties;
	children?: React.ReactNode;
	isScrollDetectionDown?: boolean;
};

const BannerContainer: React.FC<BannerContainerProps> = ({
	isScrollDetectionDown,
	children,
}) => {
	return (
		<div
			className={`${styles.BannerContainer} ${
				isScrollDetectionDown ? styles.ScrollDown : styles.ScrollUp
			}`}
		>
			{children}
		</div>
	);
};

export default BannerContainer;
