// Style Imports
import styles from './NFTMedia.module.css';

// Local Imports
import { MediaContainerProps } from './types';

const IPFSMedia = (props: MediaContainerProps) => {
	//////////////////
	// State & Data //
	//////////////////

	const { alt, ipfsUrl, isVideo, onLoad, size, style } = props;

	///////////////
	// Functions //
	///////////////

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

	///////////////
	// Fragments //
	///////////////

	return (
		<>
			{!isVideo && (
				<img
					alt={alt}
					className={styles.Media}
					onClick={props.onClick}
					onLoad={onLoad}
					src={ipfsUrl}
					style={style}
				/>
			)}
			{isVideo && (
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
