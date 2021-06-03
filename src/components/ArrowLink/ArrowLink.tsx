//- React Imports
import React from 'react';

//- Style Imports
import styles from './ArrowLink.module.css';

type ArrowLinkProps = {
	children: React.ReactNode;
	href?: string;
	style?: React.CSSProperties;
	className?: string;
	back?: boolean;
};

const ArrowLink: React.FC<ArrowLinkProps> = ({
	className,
	href,
	children,
	style,
	back,
}) => {
	return (
		<a
			className={`${className} ${styles.Link}`}
			style={style}
			href={href}
			target="_blank"
			rel="noreferrer"
		>
			{children}{' '}
			<div className={`${styles.ArrowContainer} ${back ? styles.Back : ''}`}>
				<div className={styles.Arrow}></div>
			</div>
		</a>
	);
};

export default ArrowLink;
