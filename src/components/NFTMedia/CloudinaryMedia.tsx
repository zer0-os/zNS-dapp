// React Imports
import React, { SyntheticEvent, useEffect, useRef } from 'react';

// Style Imports
import styles from './NFTMedia.module.css';

// Library Imports
import { Image, Transformation, Video } from 'cloudinary-react';

// Local Imports
import { CloudinaryMediaProps } from './types';
import { cloudName, folder, generateVideoPoster } from './config';

const CloudinaryMedia = (props: CloudinaryMediaProps) => {
	//////////////////
	// State & Data //
	//////////////////

	const { alt, hash, isPlaying, isVideo, onLoad, size, style } = props;
	const videoRef = useRef<HTMLVideoElement>();

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

	// Runs when content is loading
	// For images - when the image is fully loaded
	// For videos - when the metadata is fully loaded
	const load = (e: SyntheticEvent) => {
		videoRef.current = e.target as HTMLVideoElement;
		if (props.onLoad) {
			props.onLoad();
		}
	};

	// Converts a size e.g. "large", "medium", etc.
	// into a number to feed into Cloudinary
	const getHeight = () => {
		switch (size as string) {
			case 'large':
				return '1000';
			case 'medium':
				return '500';
			case 'small':
				return '300';
			case 'tiny':
				return '50';
			default:
				return undefined;
		}
	};
	const height = size !== undefined && getHeight();

	// For some reason, Cloudinary SDK isn't
	// applying the crop options video posters,
	// so I'm adding them manually
	const cropOptions = () => {
		switch (size as string) {
			case 'large':
				return 'c_fit,h_1000,w_1000';
			case 'medium':
				return 'c_fit,h_500,w_500';
			case 'small':
				return 'c_fit,h_300,w_300';
			case 'tiny':
				return 'c_fit,h_50,w_50';
			default:
				return '';
		}
	};
	const crop = size !== undefined && cropOptions();

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		if (videoRef.current) {
			if (isPlaying) {
				videoRef.current.play();
			} else {
				videoRef.current.pause();
			}
		}
	}, [isPlaying]);

	///////////////
	// Fragments //
	///////////////

	return (
		<>
			{!isVideo && (
				<Image
					alt={alt}
					className={styles.Media}
					cloudName={cloudName}
					onClick={props.onClick}
					onError={props.onError}
					onLoad={onLoad}
					publicId={`${folder}/${hash}`}
					secure={true}
					style={style}
				>
					{height && (
						<Transformation height={height} width={height} crop="fit" />
					)}
				</Image>
			)}
			{isVideo && (
				<Video
					alt={alt}
					autoPlay={true}
					className={styles.Media}
					cloudName={cloudName}
					controls={size === undefined}
					loop={true}
					muted
					onClick={clickVideo}
					onError={props.onError}
					onLoadedMetadata={load}
					playsInline
					poster={generateVideoPoster(hash, crop as string)}
					preload="metadata"
					publicId={`${folder}/${hash}`}
					secure={true}
					style={style}
				>
					{height && (
						<Transformation width={height} height={height} crop="fit" />
					)}
				</Video>
			)}
		</>
	);
};

export default React.memo(CloudinaryMedia);
