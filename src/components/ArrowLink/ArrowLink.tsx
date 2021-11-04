//- React Imports
import React from 'react';

//- Style Imports
import styles from './ArrowLink.module.scss';

type ArrowLinkProps = {
	children: React.ReactNode;
	href?: string;
	style?: React.CSSProperties;
	className?: string;
	back?: boolean;
};

export const TEST_ID = {
	CONTAINER: 'arrow-link-container',
	ARROW: {
		CONTAINER: 'arrow-link-arrow-container',
		ARROW: 'arrow-link-arrow',
	},
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
			data-testid={TEST_ID.CONTAINER}
		>
			{children}{' '}
			<div
				className={`${styles.ArrowContainer} ${back ? styles.Back : ''}`}
				data-testid={TEST_ID.ARROW.CONTAINER}
			>
				<div className={styles.Arrow} data-testid={TEST_ID.ARROW.ARROW}></div>
			</div>
		</a>
	);
};

export default ArrowLink;
