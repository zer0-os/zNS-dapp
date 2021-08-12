//- React Imports
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';

//- Component Imports
import { Image } from 'components';

//- Library Imports
import { getMetadata } from 'lib/metadata';

//- Type Imports
import { Metadata } from 'lib/types';

//- Style Imports
import styles from './Artwork.module.css';

type ArtworkProps = {
	domain: string;
	disableInteraction?: boolean;
	id: string;
	image?: string;
	metadataUrl?: string;
	name?: string;
	pending?: boolean;
	style?: React.CSSProperties;
};

const Artwork: React.FC<ArtworkProps> = ({
	domain,
	disableInteraction,
	id,
	image,
	metadataUrl,
	name,
	pending,
	style,
}) => {
	const isMounted = useRef(false);
	const [metadata, setMetadata] = useState<Metadata | undefined>();
	const [truncatedDomain, setTruncatedDomain] = useState<string | undefined>();

	useEffect(() => {
		// Get metadata
		isMounted.current = true;
		if (metadataUrl) {
			getMetadata(metadataUrl).then((m: Metadata | undefined) => {
				if (isMounted.current === true) setMetadata(m);
			});
		}

		// Truncate
		if (domain.length > 30) {
			const split = domain.split('.');
			if (isMounted.current === true)
				setTruncatedDomain('wilder...' + split[split.length - 1]);
		}

		return () => {
			isMounted.current = false;
		};
	}, []);

	return (
		<>
			{/* TODO: Remove overlay from child */}
			<div className={`${styles.Artwork} ${styles.Pending}`} style={style}>
				<div className={styles.Image}>
					<Image style={{ zIndex: 2 }} src={image || metadata?.image || ''} />
				</div>
				<div className={styles.Info}>
					{(name || metadata?.title) && (
						<span
							style={{ cursor: pending ? 'default' : 'pointer' }}
							className={styles.Title}
						>
							{metadata?.title || name}
						</span>
					)}
					{!pending && (
						<>
							{disableInteraction && (
								<span className={styles.Domain}>
									{truncatedDomain || domain}
								</span>
							)}
							{!disableInteraction && (
								<Link
									className={styles.Domain}
									to={domain.split('wilder.')[1]}
									target="_blank"
									rel="noreferrer"
								>
									{truncatedDomain || domain}
								</Link>
							)}
						</>
					)}
					{pending && <span className={styles.Domain}>{domain}</span>}
				</div>
			</div>
		</>
	);
};

export default Artwork;
