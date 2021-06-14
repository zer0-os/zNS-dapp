//- React Imports
import React from 'react';

//- Component Imports
import { Image } from 'components';

//- Style Imports
import styles from './Artwork.module.css';

//- Library Imports
import useMvpVersion from 'lib/hooks/useMvpVersion';

type ArtworkProps = {
	id: string;
	name: string;
	image: string;
	domain: string;
	pending?: boolean;
};

const Artwork: React.FC<ArtworkProps> = ({
	id,
	name,
	image,
	domain,
	pending,
}) => {
	return (
		<>
			{/* TODO: Remove overlay from child */}
			<div className={`${styles.Artwork} ${styles.Pending}`}>
				<div className={styles.Image}>
					<Image
						onClick={() => console.warn('Member clicks not yet implemented')}
						src={image}
					/>
				</div>
				<div className={styles.Info}>
					<span
						style={{ cursor: pending ? 'default' : 'pointer' }}
						className={styles.Title}
					>
						{name}
					</span>
					{!pending && (
						<a className={styles.Domain} target="_blank" rel="noreferrer">
							{domain}
						</a>
					)}
					{pending && <span className={styles.Domain}>{domain}</span>}
				</div>
			</div>
		</>
	);
};

export default Artwork;
