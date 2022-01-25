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

export const TEST_ID = {
	ARTWORK: 'artwork',
	CONTAINER: 'container',
	DISABLE_LINK: 'disable-link',
	LINK: 'link',
	PENDING: 'pending',
	SHOULD_ANIMATE: 'should-animate',
	SHOULD_NOT_ANIMATE: 'should-not-animate',
	ARTWORK_CONTAINER: 'artwork-container',
};

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
				if (isMounted.current === true) {
					setMetadata(m);
				}
			});
		}

		// Truncate
		if (domain && ('wilder.' + domain).length > 30) {
			const split = domain.split('.');
			if (isMounted.current === true) {
				setTruncatedDomain('wilder...' + split[split.length - 1]);
			}
		} else {
			if (isMounted.current === true) {
				setTruncatedDomain(undefined);
			}
		}

		return () => {
			isMounted.current = false;
		};
	}, [domain, metadataUrl]);

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
				ipfsUrl={metadata?.image_full || metadata?.image || ''}
				data-testid={TEST_ID.ARTWORK}
			/>
		);
	}, [metadata]);

	return (
		<>
			{/* TODO: Remove overlay from child */}
			<div
				className={`${styles.Artwork} ${styles.Pending}`}
				style={style}
				data-testid={TEST_ID.CONTAINER}
			>
				<div className={styles.Image} data-testid={TEST_ID.ARTWORK_CONTAINER}>
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
							// data-testid={TEST_ID.SHOULD_ANIMATE}
						>
							{(animatedStyles) => (
								<animated.div style={animatedStyles}>
									<span
										style={{ cursor: pending ? 'default' : 'pointer' }}
										className={styles.Title}
										data-testid={TEST_ID.SHOULD_ANIMATE}
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
							data-testid={TEST_ID.SHOULD_NOT_ANIMATE}
						>
							{metadata?.title || name}
						</span>
					)}
					{!pending && (
						<>
							{disableInteraction && (
								<span
									className={styles.Domain}
									data-testid={TEST_ID.DISABLE_LINK}
								>
									{truncatedDomain || 'wilder.' + domain}
								</span>
							)}
							{!disableInteraction && domain && (
								<Link
									className={styles.Domain}
									to={domain.split('wilder.')[1]}
									target="_blank"
									rel="noreferrer"
									data-testid={TEST_ID.LINK}
								>
									{truncatedDomain || domain}
								</Link>
							)}
						</>
					)}
					{pending && (
						<span data-testid={TEST_ID.PENDING} className={styles.Domain}>
							{domain}
						</span>
					)}
				</div>
			</div>
		</>
	);
};

export default Artwork;
