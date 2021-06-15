//- React Imports
import React from 'react';
import { Link } from 'react-router-dom';

//- Component Imports
import { Image } from 'components';

//- Style Imports
import styles from './Artwork.module.css';

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
