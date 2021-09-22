//- React Imports
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Spring, animated } from 'react-spring';

//- Component Imports
import { Image, NFTMedia } from 'components';

//- Library Imports
import { getMetadata } from 'lib/metadata';

//- Type Imports
import { Metadata } from 'lib/types';

//- Style Imports
import styles from './Artwork.module.css';
import LazyLoad from 'react-lazyload';

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
	const loadTime = useRef<Date | undefined>();
	const [metadata, setMetadata] = useState<Metadata | undefined>();
	const [truncatedDomain, setTruncatedDomain] = useState<string | undefined>();
	const [shouldAnimate, setShouldAnimate] = useState<boolean>(true);

	useEffect(() => {
		// Get metadata
		isMounted.current = true;
		if (!loadTime.current) loadTime.current = new Date();
		if (metadataUrl) {
			getMetadata(metadataUrl).then((m: Metadata | undefined) => {
				if (loadTime.current && isMounted.current) {
					// If the metadata was loaded fast it was probably
					// from cache, so we should just skip the animation
					const loadedInMs = new Date().getTime() - loadTime.current.getTime();
					setShouldAnimate(loadedInMs > 60);
				}
				if (isMounted.current === true) {
					setMetadata(m);
				}
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
	}, [metadataUrl]);

	const artwork = React.useMemo(() => {
		return (
			<NFTMedia
				disableLightbox
				style={{
					zIndex: 2,
				}}
				size="tiny"
				className={`${styles.Image} border-rounded`}
				alt="NFT Preview"
				ipfsUrl={metadata?.image || ''}
			/>
		);
	}, [metadata]);

	return (
		<>
			{/* TODO: Remove overlay from child */}
			<div className={`${styles.Artwork} ${styles.Pending}`} style={style}>
				<div className={styles.Image}>{artwork}</div>
				<div className={styles.Info}>
					{shouldAnimate && (metadata?.title || name) && (
						<Spring
							from={{ maxHeight: 0, opacity: 0 }}
							to={{ maxHeight: 18, opacity: 1 }}
						>
							{(animatedStyles) => (
								<animated.div style={animatedStyles}>
									<span
										style={{ cursor: pending ? 'default' : 'pointer' }}
										className={styles.Title}
									>
										{metadata?.title || name}
									</span>
								</animated.div>
							)}
						</Spring>
					)}
					{!shouldAnimate && metadata?.title && (
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
