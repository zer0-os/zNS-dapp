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
};

const Artwork: React.FC<ArtworkProps> = ({
	domain,
	disableInteraction,
	id,
	image,
	metadataUrl,
	name,
	pending,
}) => {
	const isMounted = useRef(false);
	const [metadata, setMetadata] = useState<Metadata | undefined>();

	useEffect(() => {
		isMounted.current = true;
		if (metadataUrl) {
			getMetadata(metadataUrl).then((m: Metadata | undefined) => {
				if (isMounted.current === true) setMetadata(m);
			});
		}
	}, []);

	return (
		<>
			{/* TODO: Remove overlay from child */}
			<div className={`${styles.Artwork} ${styles.Pending}`}>
				<div className={styles.Image}>
					<Image style={{ zIndex: 2 }} src={image || metadata?.image || ''} />
				</div>
				<div className={styles.Info}>
					{(name || metadata?.title) && (
						<span
							style={{ cursor: pending ? 'default' : 'pointer' }}
							className={styles.Title}
						>
							{name || metadata?.title || ' '}
						</span>
					)}
					{!pending && (
						<>
							{disableInteraction && (
								<span className={styles.Domain}>{domain}</span>
							)}
							{!disableInteraction && (
								<Link
									className={styles.Domain}
									to={domain.split('wilder.')[1]}
									target="_blank"
									rel="noreferrer"
								>
									{domain}
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
