//- React Imports
import React, { useState } from 'react';

//- Style Imports
import styles from './PageHeader.module.scss';

//- Containers Imports
import { WheelsRaffle } from 'containers';

//- Component Imports
import WilderIcon from 'components/WilderIcon/WilderIcon';

//- Lib Imports
import useScrollDetection from 'lib/hooks/useScrollDetection';

type HeaderProps = {
	style?: React.CSSProperties;
	children?: React.ReactNode;
};

const PageHeader: React.FC<HeaderProps> = ({ style, children }) => {
	const [hideNavBar, setHideNavBar] = useState(false);

	useScrollDetection(setHideNavBar);

	return (
		<div className={styles.PageHeaderContainer}>
			{/* TODO: Make a more generic Nav component and nest FilterBar and TitleBar */}
			<nav
				className={`${styles.NavBar} blur ${hideNavBar ? styles.Hidden : ''}`}
				style={style}
			>
				<WilderIcon />
				{/* Replace children with TitleBar */}
				{children}
			</nav>
			<div
				className={`${styles.BannerContainer} ${
					hideNavBar ? styles.ScrollDown : styles.ScrollUp
				}`}
			>
				<WheelsRaffle />
			</div>
		</div>
	);
};

export default PageHeader;
