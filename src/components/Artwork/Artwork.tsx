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
};

const Artwork: React.FC<ArtworkProps> = ({ id, name, image, domain }) => {
	return (
		<>
			{/* TODO: Remove overlay from child */}
			<div className={styles.Artwork}>
				<div className={styles.Image}>
					<Image
						onClick={() => console.warn('Member clicks not yet implemented')}
						src={image}
					/>
				</div>
				<div className={styles.Info}>
					<span>{name}</span>
					<a target="_blank" rel="noreferrer">
						{domain}
					</a>
				</div>
			</div>
		</>
	);
};

export default Artwork;
