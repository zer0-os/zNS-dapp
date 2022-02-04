import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';
import React, { useMemo, useRef } from 'react';

import { Link } from 'react-router-dom';

import styles from './ZNALink.module.scss';

type ZNAProps = {
	className?: string;
	style?: React.CSSProperties;
};

const ZNALink: React.FC<ZNAProps> = ({ className, style }) => {
	const globalDomain = useCurrentDomain();
	const oldDomainRef = useRef('');

	const parsedDomain = useMemo(() => {
		if (!globalDomain.domain?.name) {
			return oldDomainRef.current;
		} else {
			oldDomainRef.current = globalDomain.domain?.name;
			return globalDomain.domain?.name;
		}
	}, [globalDomain.domain]);

	return (
		<div
			className={`${styles.ZNALink} ${className ? className : ''}`}
			style={style}
		>
			<span style={{ cursor: 'default', opacity: 0.75 }}>0://</span>
			{parsedDomain.split('.').map((part, i) => {
				const linkTarget =
					part === 'wilder'
						? ''
						: `/${parsedDomain
								.split('.')
								.slice(0, i + 1)
								.join('.')
								.replace('wilder.', '')}`;
				return (
					<Link
						key={i + part}
						style={{ textDecoration: 'none', color: 'white' }}
						to={`${globalDomain.app}${linkTarget}`}
					>
						{i > 0 ? `.${part}` : part}
					</Link>
				);
			})}
		</div>
	);
};

export default ZNALink;
