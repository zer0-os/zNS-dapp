// Style Imports
import { useEffect, useState } from 'react';
import styles from './NFTMedia.module.css';

// Local Imports
import { MediaContainerProps } from './types';

const IPFSMedia = (props: MediaContainerProps) => {
	//////////////////
	// State & Data //
	//////////////////

	const { alt, ipfsUrl, onLoad, size, style } = props;

	///////////////
	// Functions //
	///////////////

	const [imageFailed, setImageFailed] = useState<boolean>(false);

	// Click handler for videos
	// Prevents prop onClick if controls
	// are rendered -- this is to prevent opening
	// video in lightbox when fullscreen control is available
	const clickVideo = (e: any) => {
		if (size === undefined) {
			e.stopPropagation();
		} else if (props.onClick) {
			props.onClick();
		}
	};

	// This is a hack to get iOS videos working
	// iOS doesn't like loading URLs with no file extension into
	// video tags, however it doesn't mind showing them in img tags.
	// So first, we try to show the content in an image tag, and if that fails
	// (which it will everywhere apart from iOS) try it in a video tag
	const failedToLoadInImageTag = () => {
		setImageFailed(true);
	};

	useEffect(() => {
		setImageFailed(false);
	}, [ipfsUrl]);

	///////////////
	// Fragments //
	///////////////

	return (
		<>
			{!imageFailed && (
				<img
					alt={alt}
					className={styles.Media}
					onClick={props.onClick}
					onError={failedToLoadInImageTag}
					onLoad={onLoad}
					src={ipfsUrl}
					style={style}
				/>
			)}
			{imageFailed && (
				<video
					autoPlay
					className={styles.Media}
					controls={size === undefined}
					muted
					onClick={clickVideo}
					onLoadedMetadata={onLoad}
					src={ipfsUrl}
					style={style}
				/>
			)}
		</>
	);
};

export default IPFSMedia;
