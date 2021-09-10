import React from 'react';

import { Link } from 'react-router-dom';

import styles from './ZNALink.module.css';

type ZNAProps = {
	className?: string;
	domain: string;
	style?: React.CSSProperties;
};

const ZNALink: React.FC<ZNAProps> = ({ className, domain, style }) => {
	return (
		<div
			className={`${styles.ZNALink} ${className ? className : ''}`}
			style={style}
		>
			<a href='https://www.zero.tech/'  target="_blank" rel="noreferrer" style={{ cursor: 'cursor', opacity: 0.75, color: 'white' }}>0://</a>
			<Link style={{ textDecoration: 'none', color: 'white' }} to={''}>
				wilder
			</Link>
			{domain !== '/' && <span className={styles.Dots}>..</span>}
			{domain.split('.').map((part, i) => {
				if (part === '/') return '';
				return i === 0 ? (
					<Link
						key={i}
						style={{ textDecoration: 'none', color: 'white' }}
						to={part}
					>
						.{part.charAt(0) === '/' ? part.substring(1, part.length) : part}
					</Link>
				) : (
					<Link
						key={i}
						style={{ textDecoration: 'none', color: 'white' }}
						to={domain
							.split('.')
							.slice(0, i + 1)
							.join('.')}
					>
						{i > 0 ? `.${part}` : part}
					</Link>
				);
			})}
		</div>
	);
};

export default ZNALink;
