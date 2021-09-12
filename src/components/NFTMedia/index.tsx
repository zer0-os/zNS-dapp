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
import styles from './NFTMedia.module.css';

// Component Imports
import { Overlay, Spinner } from 'components';
import IPFSMedia from './IPFSMedia';
import CloudinaryMedia from './CloudinaryMedia';

// Local Imports
import { cloudinaryImageBaseUrl, cloudinaryVideoBaseUrl } from './config';

// Possible media types based on
// MIME type of content
enum MediaType {
	Image, // image/*
	Video, // video/*
	Unknown, // unhandled
}

type Media = {
	mediaType: MediaType;
	extension: string;
};

const NFTMediaContainer = (props: MediaContainerProps) => {
	//////////////////
	// State & Data //
	//////////////////

	const { alt, className, disableLightbox, ipfsUrl, size, style } = props;
	const isMounted = useRef(false);

	// Handling lightbox open/close
	const [isLightboxOpen, setIsLightboxOpen] = useState<boolean>(false);

	// Media details
	const [isCloudinaryUrl, setIsCloudinaryUrl] = useState<boolean | undefined>();
	const [isMediaLoading, setIsMediaLoading] = useState<boolean>(true);
	const [mediaLocation, setMediaLocation] = useState<string | undefined>();
	const [mediaType, setMediaType] = useState<MediaType | undefined>();

	///////////////
	// Functions //
	///////////////

	// Pulls the IPFS hash from an IPFS url
	// https://ipfs.fleek.co/ipfs/QmNr4mi2T4Qm5ErtnSdxA7a5nCPT2YkF5gAPnLm8oSCXY8
	// turns into
	// QmNr4mi2T4Qm5ErtnSdxA7a5nCPT2YkF5gAPnLm8oSCXY8
	const getHashFromIPFSUrl = (url: string) => {
		const hashIndex = url.lastIndexOf('/') + 1;
		return url.slice(hashIndex);
	};

	// Sets internal "media loading" state
	// when media loads - this is passed down
	// to the image or video components
	const onLoadMedia = () => {
		setIsMediaLoading(false);
	};

	// Toggles internal lightbox state object
	// i.e. shows/hides lightbox
	const toggleLightbox = () => {
		if (!disableLightbox) {
			setIsLightboxOpen(!isLightboxOpen);
		}
	};

	// Pings Cloudinary to see if a link exists
	// for a given NFT's hash
	// @todo should change to more generic "checkUrlIsValid"
	// and take URL as parameter
	const checkHasCloudinaryUrl = (isVideo: boolean, extension: string) => {
		return new Promise((resolve, reject) => {
			// Strip the IPFS hash from ipfs.io URL in NFT metadata
			const hash = getHashFromIPFSUrl(ipfsUrl);

			// Check if Cloudinary URL exists
			const cloudinaryUrl =
				(isVideo ? cloudinaryVideoBaseUrl : cloudinaryImageBaseUrl) +
				hash +
				'.' +
				extension;

			fetch(cloudinaryUrl, { method: 'HEAD' }).then((r: Response) => {
				resolve(r.status === 200);
			});
		});
	};

	// Gets MIME type of media at URL
	// Useful because our IPFS links don't have
	// a file extension
	// @todo should take a URL as parameter
	const checkMediaType = () => {
		return new Promise((resolve, reject) => {
			// @todo switch to a fetch
			var xhttp = new XMLHttpRequest();
			xhttp.open('HEAD', ipfsUrl);
			xhttp.onreadystatechange = function () {
				if (this.readyState === this.DONE) {
					const mimeType = this.getResponseHeader('Content-Type');
					if (mimeType?.includes('image')) {
						resolve({
							mediaType: MediaType.Image,
							extension: mimeType.split('/')[1],
						});
					} else if (mimeType?.includes('video')) {
						resolve({
							mediaType: MediaType.Video,
							extension: mimeType.split('/')[1],
						});
					}
					resolve({
						mediaType: MediaType.Unknown,
						extension: '',
					});
				}
			};
			xhttp.send();
		});
	};

	// Gets data for media
	// 1. Gets media type from IPFS URL
	// 2. Checks if a Cloudinary URL exists
	// 3. Sets state based on data from 1 and 2
	const getMediaData = async () => {
		// 1.
		const { mediaType, extension } = (await checkMediaType()) as Media;

		// 2.
		const hasCloudinaryUrl = (await checkHasCloudinaryUrl(
			mediaType === MediaType.Video,
			extension,
		)) as boolean;

		// 3.
		if (isMounted.current) {
			// Assign data
			setMediaType(mediaType);
			if (hasCloudinaryUrl) {
				setIsCloudinaryUrl(true);
				setMediaLocation(getHashFromIPFSUrl(ipfsUrl));
			} else {
				setIsCloudinaryUrl(false);
				setMediaLocation(ipfsUrl);
			}
		}
	};

	// Resets relevant state objects
	// Sometimes react-table does weird stuff
	// to enhance performance - this should handle those
	// cases
	const resetState = () => {
		if (isMounted.current) {
			setIsCloudinaryUrl(undefined);
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
		if (isCloudinaryUrl) {
			return (
				<CloudinaryMedia
					alt={alt}
					hash={mediaLocation!}
					isPlaying={!isLightboxOpen}
					isVideo={mediaType === MediaType.Video}
					onClick={toggleLightbox}
					onLoad={onLoadMedia}
					size={matchSize ? size : undefined}
					style={{ ...style, opacity: isMediaLoading ? 0 : 1 }}
				/>
			);
		} else if (!isCloudinaryUrl) {
			return (
				<IPFSMedia
					alt={alt}
					ipfsUrl={mediaLocation!}
					isVideo={mediaType === MediaType.Video}
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
			className={`${styles.Container} ${className ? className : ''}`}
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

export default NFTMediaContainer;
