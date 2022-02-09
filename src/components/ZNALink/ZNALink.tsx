import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import styles from './ZNALink.module.scss';
import { parseDomainFromURI } from 'lib/utils';

type ZNAProps = {
	className?: string;
	style?: React.CSSProperties;
};

const ZNALink: React.FC<ZNAProps> = ({ className, style }) => {
	const { location } = useHistory();
	const domain = parseDomainFromURI(location.pathname);

	return (
		<div
			className={`${styles.ZNALink} ${className ? className : ''}`}
			style={style}
		>
			<span style={{ cursor: 'default', opacity: 0.75 }}>0://</span>
			<Link style={{ textDecoration: 'none', color: 'white' }} to={`/market/`}>
				wilder
			</Link>
			{domain.split('.').map((part, i) => {
				if (part === '') {
					return undefined;
				}
				const linkTarget = `/market/${domain
					.split('.')
					.slice(0, i + 1)
					.join('.')
					.replace('wilder.', '')}`;
				return (
					<Link
						key={i + part}
						style={{ textDecoration: 'none', color: 'white' }}
						to={linkTarget}
					>
						{'.' + part}
					</Link>
				);
			})}
		</div>
	);
};

export default ZNALink;
