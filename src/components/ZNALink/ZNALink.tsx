import React from 'react';

import { Link, useLocation } from 'react-router-dom';

import styles from './ZNALink.module.scss';
import classNames from 'classnames';
import { appFromPathname, zNAFromPathname } from 'lib/utils';

type ZNAProps = {
	className?: string;
	style?: React.CSSProperties;
};

const ZNALink: React.FC<ZNAProps> = ({ className, style }) => {
	const { pathname } = useLocation();
	const zna = zNAFromPathname(pathname);
	const app = appFromPathname(pathname) + '/';

	const isRootDomain = zna.length === 0;

	const adjustedZna = isRootDomain ? '' : '' + zna;
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
