//- React Imports
import React from 'react';
import { Link } from 'react-router-dom';

//- Style Imports
import styles from './ArrowLink.module.scss';

type ArrowLinkProps = {
	children: React.ReactNode;
	href?: string;
	style?: React.CSSProperties;
	to?: string;
	replace?: boolean;
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
	replace,
	style,
	back,
}) => {
	const content = (
		<>
			{children}{' '}
			<div
				className={`${styles.ArrowContainer} ${back ? styles.Back : ''}`}
				data-testid={TEST_ID.ARROW.CONTAINER}
			>
				<div className={styles.Arrow} data-testid={TEST_ID.ARROW.ARROW}></div>
			</div>
		</>
	);

	const sharedProps = {
		className: `${className} ${styles.Link}`,
		style: style,
		target: !replace ? '_blank' : undefined,
		rel: 'noreferrer',
		'data-testid': TEST_ID.CONTAINER,
	};

	/**
	 * 04/04/2022
	 * For some reason, we're still using an <a> tag even when there's no
	 * href. Going to leave it like this for now, but we should
	 * refactor this in the future.
	 */
	return href ? (
		<Link {...sharedProps} to={href}>
			{content}
		</Link>
	) : (
		<a {...sharedProps}>{content}</a>
	);
};

export default ArrowLink;
