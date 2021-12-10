//- React Imports
import React from 'react';

//- Style Imports
import styles from './PageHeader.module.scss';

type HeaderProps = {
	style?: React.CSSProperties;
	children?: React.ReactNode;
	hideNavBar?: boolean;
};

const PageHeader: React.FC<HeaderProps> = ({ style, children, hideNavBar }) => {
	return (
		<>
			<nav
				className={`${styles.NavBar} blur ${hideNavBar ? styles.Hidden : ''}`}
				style={style}
			>
				{children}
			</nav>
		</>
	);
};

export default PageHeader;
