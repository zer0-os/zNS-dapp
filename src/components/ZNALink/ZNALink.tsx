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
			<Link to='zero.tech https://zer0.io/a/network/tasks/board/e85a99cf-665f-427c-bb0b-2b4e12ba207a/e9afb52b-2b5f-493c-adab-88576637fb92' style={{ cursor: 'default', opacity: 0.75 }}>0://</Link>
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
