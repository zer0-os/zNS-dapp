// React Imports
import React, { SyntheticEvent, useEffect, useRef } from 'react';

// Style Imports
import styles from './NFTMedia.module.css';

// Library Imports
import { Image, Transformation, Video } from 'cloudinary-react';

// Local Imports
import { CloudinaryMediaProps } from './types';
import {
	cloudName,
	folder,
	generateCloudinaryUrl,
	generateVideoPoster,
} from './config';

const CloudinaryMedia = (props: CloudinaryMediaProps) => {
	//////////////////
	// State & Data //
	//////////////////

	const { alt, hash, isPlaying, isVideo, onLoad, onError, size, style } = props;
	const videoRef = useRef<HTMLVideoElement>();

	const isIos = navigator.userAgent.includes('Mac') && 'ontouchend' in document;
	const isMobile =
		/Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini|Windows Phone/i.test(
			navigator.userAgent,
		);

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

	const loadVideo = (e: SyntheticEvent) => {
		videoRef.current = e.target as HTMLVideoElement;
		if (videoRef.current) {
			var playPromise = videoRef.current.play();

			if (playPromise !== undefined) {
				playPromise.catch((error: any) => {
					// Auto-play was prevented
					// Show paused UI.
					console.warn(
						'Video autoplay interrupted by reload for ipfs.fleek.co/ipfs/' +
							hash,
					);
				});
			}
		}
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

	const url = generateCloudinaryUrl(
		hash,
		isVideo ? 'video' : 'image',
		cropOptions(),
	);

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

	//
	// Image handlers
	//

	// If it's not a video
	if (!isVideo) {
		return (
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
				{height && <Transformation height={height} width={height} crop="fit" />}
			</Image>
		);
	}

	//
	// Video handlers
	//

	// If it is a video, but we want the thumbnail only
	// If we're on iOS and not showing the full size,
	if (size === 'tiny' || (size !== undefined && (isIos || isMobile))) {
		return (
			<img
				alt={alt}
				className={styles.Media}
				onClick={props.onClick}
				onError={props.onError}
				onLoad={onLoad}
				src={generateVideoPoster(hash, crop as string)}
				style={style}
			/>
		);
	}

	// If we're on iOS, need to handle videos differently
	if (isIos) {
		return (
			<>
				<video
					autoPlay={true}
					className={styles.Media}
					controls={size === undefined}
					loop={true}
					muted
					onClick={clickVideo}
					onError={props.onError}
					onLoadedMetadata={loadVideo}
					playsInline
					poster={generateVideoPoster(hash, crop as string)}
					style={style}
					src={url + '.mp4'}
				></video>
			</>
		);
	}

	// Rendering videos normal way
	return (
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
			onLoadedMetadata={loadVideo}
			playsInline
			poster={generateVideoPoster(hash, crop as string)}
			preload="metadata"
			publicId={`${folder}/${hash}${size !== undefined ? '.jpg' : ''}`}
			secure={true}
			style={style}
		>
			{height && <Transformation width={height} height={height} crop="fit" />}
		</Video>
	);
};

export default React.memo(CloudinaryMedia);
