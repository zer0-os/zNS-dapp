//- React Imports
import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { Spring, animated } from 'react-spring';

//- Component Imports
import { NFTMedia, Image } from 'components';

//- Library Imports
import { getMetadata } from 'lib/metadata';

//- Type Imports
import { Metadata } from 'lib/types';

//- Style Imports
import styles from './Artwork.module.scss';
import classNames from 'classnames/bind';
import { ROOT_DOMAIN } from '../../constants/domains';

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
	subtext?: string;
	shouldUseCloudinary?: boolean;
};

const cx = classNames.bind(styles);

const Artwork: React.FC<ArtworkProps> = ({
	circleIcon,
	domain,
	disableAnimation,
	disableInteraction,
	image,
	metadataUrl,
	name,
	pending,
	style,
	subtext,
	shouldUseCloudinary,
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
		setMetadata(undefined);
		if (metadataUrl) {
			getMetadata(metadataUrl).then((m: Metadata | undefined) => {
				if (loadTime.current && isMounted.current) {
					// If the metadata was loaded fast it was probably
					// from cache, so we should just skip the animation
					const loadedInMs = new Date().getTime() - loadTime.current.getTime();
					setShouldAnimate(loadedInMs > 60);
				}
				if (isMounted.current) {
					setMetadata(m);
				}
			});
		}

		// Truncate
		if (domain && name && name.length > 40) {
			const split = domain.split('.');
			if (isMounted.current) {
				setTruncatedDomain(split[0] + '...' + split[split.length - 1]);
			}
		} else {
			if (isMounted.current) {
				setTruncatedDomain(undefined);
			}
		}

		return () => {
			isMounted.current = false;
		};

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [domain, metadataUrl]);

	const artwork = React.useMemo(() => {
		if (shouldUseCloudinary || metadata) {
			return (
				<NFTMedia
					disableLightbox
					style={{
						zIndex: 2,
					}}
					size="tiny"
					className={`${styles.Image} border-rounded`}
					alt="NFT Preview"
					ipfsUrl={image ?? metadata?.image_full ?? metadata?.image ?? ''}
				/>
			);
		}
		if (image) {
			return <Image alt="pool icon" src={image} />;
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
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
					{shouldAnimate && (metadata?.title || name) && (
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
										style={{
											cursor:
												pending || disableInteraction ? 'default' : 'pointer',
										}}
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
							style={{
								cursor: pending || disableInteraction ? 'default' : 'pointer',
							}}
							className={styles.Title}
						>
							{metadata?.title || name}
						</span>
					)}
					{!pending && (
						<>
							{disableInteraction && domain && (
								<span className={styles.Domain}>
									{truncatedDomain || domain}
								</span>
							)}
							{subtext && !domain && (
								<span className={styles.Domain}>{subtext}</span>
							)}
							{!disableInteraction && name && domain && (
								<Link
									className={styles.Domain}
									to={domain.split(ROOT_DOMAIN)[1]}
									target="_blank"
									rel="noreferrer"
								>
									{truncatedDomain || name}
								</Link>
							)}
						</>
					)}
					{pending && (
						<span className={styles.Domain}>{domain ? domain : 'Loading'}</span>
					)}
				</div>
			</div>
		</>
	);
};

export default Artwork;
