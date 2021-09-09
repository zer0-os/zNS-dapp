/*
	This container...
	- checks if we have a Cloudinary upload for given hash
		- if yes, send the Cloudinary URL to the media component
		- if no, send the IPFS URL to the media component
*/

import { useState, useEffect } from 'react';

import { MediaContainerProps } from './types';

import { Spinner } from 'components';

import IPFSMedia from './IPFSMedia';
import CloudinaryMedia from './CloudinaryMedia';

enum MediaType {
	Image,
	Video,
	Unknown,
}

const cloudinaryImageBaseUrl =
	'https://res.cloudinary.com/fact0ry/image/upload/v1/zns/';
const cloudinaryVideoBaseUrl =
	'https://res.cloudinary.com/fact0ry/video/upload/v1/zns/';

const NFTMediaContainer = (props: MediaContainerProps) => {
	// Destructure props
	const { className, style, alt, ipfsUrl, size } = props;

	// Setup some state
	const [isCloudinaryUrl, setIsCloudinaryUrl] = useState<boolean | undefined>();
	const [mediaLocation, setMediaLocation] = useState<string | undefined>();
	const [mediaType, setMediaType] = useState<MediaType | undefined>();

	const getHashFromIPFSUrl = (url: string) => {
		const hashIndex = url.lastIndexOf('/') + 1;
		return url.slice(hashIndex);
	};

	const checkHasCloudinaryUrl = (isVideo: boolean) => {
		return new Promise((resolve, reject) => {
			// Strip the IPFS hash from ipfs.io URL in NFT metadata
			const hash = getHashFromIPFSUrl(ipfsUrl);

			// Check if Cloudinary URL exists
			const cloudinaryUrl =
				(isVideo ? cloudinaryVideoBaseUrl : cloudinaryImageBaseUrl) + hash;
			fetch(cloudinaryUrl).then((r: Response) => {
				resolve(r.status === 200);
			});
		});
	};

	const checkMediaType = () => {
		return new Promise((resolve, reject) => {
			var xhttp = new XMLHttpRequest();
			xhttp.open('HEAD', props.ipfsUrl);
			xhttp.onreadystatechange = function () {
				if (this.readyState == this.DONE) {
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

	if (!mediaLocation) {
		return <Spinner />;
	}

	// If we found a Cloudinary URL
	// Render the components from react-cloudinary
	if (isCloudinaryUrl === true) {
		return (
			<CloudinaryMedia
				alt={alt}
				style={style}
				className={className}
				hash={mediaLocation!}
				size={size}
				isVideo={mediaType === MediaType.Video}
			/>
		);
	}

	// If we didn't fint a Cloudinary URL
	// Render the IPFS Media
	return (
		<IPFSMedia
			alt={alt}
			style={style}
			className={className}
			ipfsUrl={mediaLocation!}
			isVideo={mediaType === MediaType.Video}
		/>
	);
};

export default NFTMediaContainer;
