//- React Imports
import React from 'react';
import { Link, useLocation } from 'react-router-dom';

//- Library Imports
import { appFromPathname, zNAFromPathname } from 'lib/utils';

//- Constants Imports
import { IS_DEFAULT_NETWORK, ROOT_DOMAIN } from 'constants/domains';

//- Styles Imports
import styles from './ZNALink.module.scss';
import classNames from 'classnames/bind';

type ZNAProps = {
	className?: string;
	style?: React.CSSProperties;
};

const cx = classNames.bind(styles);

const ZNALink: React.FC<ZNAProps> = ({ className, style }) => {
	const { pathname } = useLocation();
	const zna = zNAFromPathname(pathname);
	const app = appFromPathname(pathname) + '/';
	const isRootDomain = zna.length === 0;
	const isRootWithSubDomain = zna.split('.').length > 2;

	const adjustedZna = isRootDomain
		? ROOT_DOMAIN
		: (IS_DEFAULT_NETWORK ? '' : ROOT_DOMAIN + '.') + zna;

	const splitZna = adjustedZna.split('.').map((z) => z.replace('.', ''));

	const segments = splitZna.map((s, index) => {
		const name = index === 0 ? s : s;

		console.log(index);

		let location =
			ROOT_DOMAIN !== ''
				? index === 0
					? ''
					: splitZna.slice(1, index).concat(name).join('.')
				: index === 0
				? name
				: splitZna.slice(0, index).concat(name).join('.');

		return {
			name,
			location,
		};
	});

	return (
		<div
			className={cx(styles.ZNALink, className, {
				isRootWithSubdomain: isRootWithSubDomain,
				isNetworkSet: ROOT_DOMAIN !== '',
			})}
			style={style}
		>
			{IS_DEFAULT_NETWORK ? (
				<Link to={app} className={styles.Root}>
					0://
				</Link>
			) : (
				<span className={styles.Root}>0://</span>
			)}
			{segments.map((s, index) => (
				<Link
					key={`segment-key: ${s.name}`}
					style={{ textDecoration: 'none', color: 'white' }}
					to={s.location}
				>
					{index > 0 && '.'}
					{s.name}
				</Link>
			))}
		</div>
	);
};

export default ZNALink;
