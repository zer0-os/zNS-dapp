import React from 'react';

import { Link, useLocation } from 'react-router-dom';

import styles from './ZNALink.module.scss';
import classNames from 'classnames';

type ZNAProps = {
	className?: string;
	style?: React.CSSProperties;
};

const ZNALink: React.FC<ZNAProps> = ({ className, style }) => {
	const { pathname } = useLocation();
	const zna = pathname.replace(/^\/[a-zA-Z]*\//, '').split('/')[0];
	const app = pathname.match(/^\/[a-zA-Z]*/)?.at(0) + '/';

	const isRootDomain = zna.length === 0;

	const adjustedZna = isRootDomain ? 'wilder' : 'wilder.' + zna;
	const segments = adjustedZna.split('.').map((s, index) => ({
		name: index === 0 ? s : '.' + s,
		location:
			app +
			adjustedZna
				.split('.')
				.slice(1, index + 1)
				.join('.'),
	}));

	return (
		<div className={classNames(styles.ZNALink, className)} style={style}>
			<span className={styles.Root}>0://</span>
			{segments.map((s) => (
				<Link
					key={s.location}
					style={{ textDecoration: 'none', color: 'white' }}
					to={s.location}
				>
					{s.name}
				</Link>
			))}
		</div>
	);
};

export default ZNALink;
