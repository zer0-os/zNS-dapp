import React from 'react';

import { Link, useLocation } from 'react-router-dom';

import { ROOT_DOMAIN } from 'constants/domains';

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

	const adjustedZna = isRootDomain
		? ROOT_DOMAIN
		: (ROOT_DOMAIN.length ? ROOT_DOMAIN + '.' : ROOT_DOMAIN) + zna;

	const segments = adjustedZna.split('.').map((s, index) => {
		const name = index === 0 ? s : '.' + s;
		let location = name;

		if (ROOT_DOMAIN.length) {
			location = name.split(ROOT_DOMAIN)[1];
		}

		return {
			name,
			location,
		};
	});

	return (
		<div className={classNames(styles.ZNALink, className)} style={style}>
			<Link to={app} className={styles.Root}>
				0://
			</Link>
			{zna.length > 0 &&
				segments.map((s) => (
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
