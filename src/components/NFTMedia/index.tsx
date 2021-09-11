/*
	This container...
	- checks if we have a Cloudinary upload for given hash
		- if yes, send the Cloudinary URL to the media component
		- if no, send the IPFS URL to the media component
*/

// React Imports
import { useState, useEffect } from 'react';

// Type Imports
import { MediaContainerProps } from './types';

// Style Imports
import styles from './NFTMedia.module.css';

// Component Imports
import { Spinner } from 'components';
import IPFSMedia from './IPFSMedia';
import CloudinaryMedia from './CloudinaryMedia';

import { cloudinaryImageBaseUrl, cloudinaryVideoBaseUrl } from './config';

enum MediaType {
	Image,
	Video,
	Unknown,
}

const NFTMediaContainer = (props: MediaContainerProps) => {
	// Destructure props
	const { className, style, alt, ipfsUrl, size } = props;

	// Setup some state
	const [isMediaLoading, setIsMediaLoading] = useState<boolean>(true);
	const [isCloudinaryUrl, setIsCloudinaryUrl] = useState<boolean | undefined>();
	const [mediaLocation, setMediaLocation] = useState<string | undefined>();
	const [mediaType, setMediaType] = useState<MediaType | undefined>();

	const getHashFromIPFSUrl = (url: string) => {
		const hashIndex = url.lastIndexOf('/') + 1;
		return url.slice(hashIndex);
	};

	const onLoadMedia = () => {
		setIsMediaLoading(false);
	};

	const checkHasCloudinaryUrl = (isVideo: boolean) => {
		return new Promise((resolve, reject) => {
			// Strip the IPFS hash from ipfs.io URL in NFT metadata
			const hash = getHashFromIPFSUrl(ipfsUrl);

			// Check if Cloudinary URL exists
			const cloudinaryUrl =
				(isVideo ? cloudinaryVideoBaseUrl : cloudinaryImageBaseUrl) + hash;
			fetch(cloudinaryUrl, { method: 'HEAD' }).then((r: Response) => {
				resolve(r.status === 200);
			});
		});
	};

	const checkMediaType = () => {
		return new Promise((resolve, reject) => {
			var xhttp = new XMLHttpRequest();
			xhttp.open('HEAD', props.ipfsUrl);
			xhttp.onreadystatechange = function () {
				if (this.readyState === this.DONE) {
					const mimeType = this.getResponseHeader('Content-Type');
					if (mimeType?.includes('image')) {
						resolve(MediaType.Image);
					} else if (mimeType?.includes('video')) {
						resolve(MediaType.Video);
					}
					resolve(MediaType.Unknown);
				}
			};
			xhttp.send();
		});
	};

	useEffect(() => {
		if (!props.ipfsUrl || !props.ipfsUrl.length) {
			return;
		}
		const getMediaData = async () => {
			// Get data
			const mediaType = (await checkMediaType()) as MediaType;
			const hasCloudinaryUrl = (await checkHasCloudinaryUrl(
				mediaType === MediaType.Video,
			)) as boolean;

			// Assign data
			setMediaType(mediaType);
			if (hasCloudinaryUrl) {
				setIsCloudinaryUrl(true);
				setMediaLocation(getHashFromIPFSUrl(ipfsUrl));
			} else {
				setIsCloudinaryUrl(false);
				setMediaLocation(ipfsUrl);
			}
		};
		getMediaData();
	}, [props.ipfsUrl]);

	return (
		<div className={styles.Container}>
			{isMediaLoading && (
				<div className={styles.Spinner}>
					<Spinner />
				</div>
			)}
			{isCloudinaryUrl === true && (
				<CloudinaryMedia
					alt={alt}
					style={style}
					className={className}
					hash={mediaLocation!}
					size={size}
					isVideo={mediaType === MediaType.Video}
					onLoad={onLoadMedia}
				/>
			)}
			{isCloudinaryUrl === false && (
				<IPFSMedia
					alt={alt}
					style={style}
					className={className}
					ipfsUrl={mediaLocation!}
					isVideo={mediaType === MediaType.Video}
					onLoad={onLoadMedia}
				/>
			)}
		</div>
	);
};

export default NFTMediaContainer;
