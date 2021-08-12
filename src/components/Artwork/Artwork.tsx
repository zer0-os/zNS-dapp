//- React Imports
import React, { useState, useEffect } from 'react';
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
	id: string;
	image?: string;
	metadataUrl?: string;
	name?: string;
	pending?: boolean;
};

const Artwork: React.FC<ArtworkProps> = ({
	domain,
	id,
	image,
	metadataUrl,
	name,
	pending,
}) => {
	const [metadata, setMetadata] = useState<Metadata | undefined>();

	useEffect(() => {
		if (metadataUrl) {
			getMetadata(metadataUrl).then((m: Metadata | undefined) =>
				setMetadata(m),
			);
		}
	}, []);

	return (
		<>
			{/* TODO: Remove overlay from child */}
			<div className={`${styles.Artwork} ${styles.Pending}`}>
				<div className={styles.Image}>
					<Image
						onClick={() => console.warn('Member clicks not yet implemented')}
						src={image || metadata?.image || ''}
					/>
				</div>
				<div className={styles.Info}>
					<span
						style={{ cursor: pending ? 'default' : 'pointer' }}
						className={styles.Title}
					>
						{name || metadata?.title || ' '}
					</span>
					{!pending && (
						<Link
							className={styles.Domain}
							to={domain}
							target="_blank"
							rel="noreferrer"
						>
							{domain}
						</Link>
					)}
					{pending && <span className={styles.Domain}>{domain}</span>}
				</div>
			</div>
		</>
	);
};

export default Artwork;
