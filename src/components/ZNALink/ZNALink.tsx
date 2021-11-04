import React from 'react';

import { Link } from 'react-router-dom';

import styles from './ZNALink.module.scss';

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
			<span style={{ cursor: 'default', opacity: 0.75 }}>0://</span>
			<Link style={{ textDecoration: 'none', color: 'white' }} to={''}>
				wilder{domain.split('').length <= 1 ? '' : '.'}
			</Link>

			{domain !== '/' && <span className={styles.Dots}>..</span>}
			{domain.split('.').map((part, i) => {
				if (part === '/') return '';
				return i === 0 ? (
					<Link
						key={i + part}
						style={{ textDecoration: 'none', color: 'white' }}
						to={part}
					>
						{part.charAt(0) === '/' ? part.substring(1, part.length) : part}
					</Link>
				) : (
					<>
						<Link
							key={i + part}
							style={{ textDecoration: 'none', color: 'white' }}
							to={domain
								.split('.')
								.slice(0, i + 1)
								.join('.')}
						>
							{i > 0 ? `.${part}` : part}
						</Link>
					</>
				);
			})}
		</div>
	);
};

export default ZNALink;
