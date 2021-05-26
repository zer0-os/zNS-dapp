//- React Imports
import React from 'react';

//- Style Imports
import styles from './ArrowLink.module.css';

type ArrowLinkProps = {
	children: React.ReactNode;
	href?: string;
	style?: React.CSSProperties;
	className?: string;
};

const ArrowLink: React.FC<ArrowLinkProps> = ({
	className,
	href,
	children,
	style,
}) => {
	return (
		<a className={`${className} ${styles.Link}`} style={style} href={href}>
			{children}{' '}
			<div className={styles.ArrowContainer}>
				<div className={styles.Arrow}></div>
			</div>
		</a>
	);
};

export default ArrowLink;
