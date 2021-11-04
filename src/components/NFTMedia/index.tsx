/* eslint-disable react-hooks/exhaustive-deps */
/*
	This container...
	- checks if we have a Cloudinary upload for given hash
		- if yes, send the Cloudinary URL to the media component
		- if no, send the IPFS URL to the media component
*/

// React Imports
import React, { useState, useEffect, useRef } from 'react';

// Type Imports
import { MediaContainerProps } from './types';

// Style Imports
import styles from './NFTMedia.module.scss';

// Component Imports
import { Overlay, Spinner } from 'components';
import IPFSMedia from './IPFSMedia';
import CloudinaryMedia from './CloudinaryMedia';

// Library Imports
import classNames from 'classnames/bind';
import { getHashFromIPFSUrl } from 'lib/ipfs';

// Possible media types based on
// MIME type of content
export enum MediaType {
	Image, // image/*
	Video, // video/*
	Unknown, // unhandled
}

const cx = classNames.bind(styles);

// Gets MIME type of media at URL
// Useful because our IPFS links don't have
// a file extension
export const checkMediaType = (hash: string) => {
	return new Promise((resolve, reject) => {
		fetch('https://ipfs.fleek.co/ipfs/' + hash, { method: 'HEAD' })
			.then((r: Response) => {
				const contentTypeHeader = r.headers.get('Content-Type');

				if (contentTypeHeader?.startsWith('image')) {
					resolve(MediaType.Image);
				} else if (contentTypeHeader?.startsWith('video')) {
					resolve(MediaType.Video);
				} else {
					resolve(MediaType.Unknown);
				}
			})
			.catch(() => {
				resolve(MediaType.Unknown);
			});
	});
};

const NFTMediaContainer = (props: MediaContainerProps) => {
	//////////////////
	// State & Data //
	//////////////////

	const { alt, className, disableLightbox, ipfsUrl, size, style } = props;
	const isMounted = useRef(false);

	// Handling lightbox open/close
	const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

	const [hasCloudinaryFailed, setHasCloudinaryFailed] =
		useState<boolean>(false);

	// Media details
	const [isMediaLoading, setIsMediaLoading] = useState<boolean>(true);
	const [mediaLocation, setMediaLocation] = useState<string | undefined>();
	const [mediaType, setMediaType] = useState<MediaType | undefined>();

	///////////////
	// Functions //
	///////////////

	// Sets internal "media loading" state
	// when media loads - this is passed down
	// to the image or video components
	const onLoadMedia = () => {
		setIsMediaLoading(false);
	};

	const onCloudinaryFailed = () => {
		console.warn('Failed to find Cloudinary link for asset ' + ipfsUrl);
		setHasCloudinaryFailed(true);
	};

	// Toggles internal lightbox state object
	// i.e. shows/hides lightbox
	const toggleLightbox = () => {
		if (!disableLightbox) {
			setIsLightboxOpen(!isLightboxOpen);
		}
	};

	// Gets data for media
	const getMediaData = async () => {
		const hash = getHashFromIPFSUrl(ipfsUrl);
		const mediaType = (await checkMediaType(hash)) as MediaType;
		if (isMounted.current) {
			setMediaType(mediaType);
			setMediaLocation(hash);
		}
	};

	// Resets relevant state objects
	// Sometimes react-table does weird stuff
	// to enhance performance - this should handle those
	// cases
	const resetState = () => {
		if (isMounted.current) {
			setIsMediaLoading(true);
			setMediaLocation(undefined);
		}
	};

	/////////////
	// Effects //
	/////////////

	// Sets isMounted flag to help prevent
	// state updates to unmounted components
	// after an async call finishes
	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	});

	// Gets all media data when IPFS url changes
	// @todo clean this up
	useEffect(() => {
		if (!props.ipfsUrl || !props.ipfsUrl.length) {
			// By returning nothing here this container
			// will just render the Spinner component
			// @todo render an error icon/message
			return;
		}
		resetState();
		getMediaData();
	}, [props.ipfsUrl]);

	///////////////
	// Fragments //
	///////////////

	// React fragment for the media component
	// @params matchSize - true if we should respect the size prop
	// useful for showing full-res version lightbox
	const mediaComponent = (
		matchSize: boolean,
		style: React.CSSProperties | undefined,
	) => {
		if (!mediaLocation) {
			return;
		}
		if (!hasCloudinaryFailed) {
			return (
				<CloudinaryMedia
					alt={alt}
					hash={mediaLocation!}
					isPlaying={!isLightboxOpen}
					isVideo={mediaType === MediaType.Video}
					onClick={toggleLightbox}
					onError={onCloudinaryFailed}
					onLoad={onLoadMedia}
					size={matchSize ? size : undefined}
					style={{ ...style, opacity: isMediaLoading ? 0 : 1 }}
					fit={props.fit}
				/>
			);
		} else {
			return (
				<IPFSMedia
					alt={alt}
					ipfsUrl={'https://ipfs.fleek.co/ipfs/' + mediaLocation!}
					onClick={toggleLightbox}
					onLoad={onLoadMedia}
					size={matchSize ? size : undefined}
					style={{ ...style, opacity: isMediaLoading ? 0 : 1 }}
				/>
			);
		}
	};

	return (
		<div
			className={cx(className, {
				Container: true,
				Cover: props.fit === 'cover',
			})}
			style={style}
		>
			{isLightboxOpen && (
				<Overlay centered img open onClose={toggleLightbox}>
					{/* @todo clean up the inline styling below */}
					<div
						className={`${styles.Container}`}
						style={{
							...style,
							borderRadius: 0,
							height: '100%',
							maxHeight: '80vh',
							maxWidth: '80vw',
							objectFit: 'contain',
							position: 'relative',
							textAlign: 'center',
							width: 'auto',
						}}
					>
						{mediaComponent(false, {
							height: '100%',
							maxHeight: '80vh',
							maxWidth: '80vw',
							objectFit: 'contain',
							position: 'relative',
							textAlign: 'center',
							width: 'auto',
						})}
					</div>
				</Overlay>
			)}
			{isMediaLoading && (
				<div className={styles.Spinner}>
					<Spinner />
				</div>
			)}
			{mediaComponent(true, undefined)}
		</div>
	);
};

export default React.memo(NFTMediaContainer);
