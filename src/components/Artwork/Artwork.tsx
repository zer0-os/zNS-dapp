//- React Imports
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Spring, animated } from 'react-spring';

//- Component Imports
import { NFTMedia, Image } from 'components';

//- Library Imports
import { getMetadata } from 'lib/metadata';
import { truncateDomain } from 'lib/utils';

//- Type Imports
import { Metadata } from 'lib/types';

//- Style Imports
import styles from './Artwork.module.scss';
import classNames from 'classnames/bind';

type ArtworkProps = {
	circleIcon?: boolean;
	domain?: string;
	disableAnimation?: boolean;
	disableInteraction?: boolean;
	id: string;
	image?: string;
	metadataUrl?: string;
	name?: string;
	pending?: boolean;
	style?: React.CSSProperties;
};

const cx = classNames.bind(styles);

const Artwork: React.FC<ArtworkProps> = ({
	circleIcon,
	domain,
	disableAnimation,
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
	const [shouldAnimate, setShouldAnimate] = useState<boolean>(true);

	useEffect(() => {
		// Get metadata
		isMounted.current = true;
		if (!loadTime.current) loadTime.current = new Date();
		setMetadata(undefined);
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

		return () => {
			isMounted.current = false;
		};
	}, [domain, metadataUrl]);

	const artwork = React.useMemo(() => {
		if (image) {
			return <Image alt="pool icon" src={image} />;
		}
		if (metadata) {
			return (
				<NFTMedia
					disableLightbox
					style={{
						zIndex: 2,
					}}
					size="tiny"
					className={`${styles.Image} border-rounded`}
					alt="NFT Preview"
					ipfsUrl={(metadata?.image_full || metadata?.image || '') as string}
				/>
			);
		}
	}, [image, metadata]);

	return (
		<>
			{/* TODO: Remove overlay from child */}
			<div className={`${styles.Artwork} ${styles.Pending}`} style={style}>
				<div
					className={cx(styles.Image, {
						Circle: circleIcon,
					})}
				>
					{artwork}
				</div>
				<div className={styles.Info}>
					{shouldAnimate && (metadata?.name || name) && (
						<Spring
							from={{
								maxHeight: disableAnimation ? 18 : 0,
								opacity: disableAnimation ? 1 : 0,
							}}
							to={{ maxHeight: 18, opacity: 1 }}
						>
							{(animatedStyles) => (
								<animated.div style={animatedStyles}>
									<span
										style={{ cursor: pending ? 'default' : 'pointer' }}
										className={styles.name}
									>
										{metadata?.name || name}
									</span>
								</animated.div>
							)}
						</Spring>
					)}
					{!shouldAnimate && metadata?.name && (
						<span
							style={{ cursor: pending ? 'default' : 'pointer' }}
							className={styles.name}
						>
							{metadata?.name || name}
						</span>
					)}
					{!pending && (
						<>
							{disableInteraction && domain && (
								<span className={styles.Domain}>{truncateDomain(domain)}</span>
							)}
							{!disableInteraction && domain && (
								<Link
									className={styles.Domain}
									to={domain.split('wilder.')[1]}
									target="_blank"
									rel="noreferrer"
								>
									{truncateDomain(domain)}
								</Link>
							)}
						</>
					)}
					{pending && (
						<span className={styles.Domain}>
							{domain ? truncateDomain(domain) : 'Loading'}
						</span>
					)}
				</div>
			</div>
		</>
	);
};

export default Artwork;
