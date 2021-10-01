// React Imports
import React, { SyntheticEvent, useCallback, useEffect, useRef } from 'react';

// Style Imports
import styles from './NFTMedia.module.css';

// Library Imports
import { Image, Transformation } from 'cloudinary-react';

// Local Imports
import { CloudinaryMediaProps } from './types';
import {
	cloudName,
	folder,
	generateCloudinaryUrl,
	generateVideoPoster,
} from './config';
import { useInView } from 'react-intersection-observer';

const CloudinaryMedia = (props: CloudinaryMediaProps) => {
	//////////////////
	// State & Data //
	//////////////////

	const { alt, hash, isVideo, onLoad, size, style } = props;
	const videoRef = useRef<HTMLVideoElement>();

	const { ref: inViewRef, entry } = useInView();

	useEffect(() => {
		if (!videoRef.current) {
			return;
		}

		try {
			if (entry?.isIntersecting) {
				var playPromise = videoRef.current.play();
				if (playPromise !== undefined) {
					playPromise.catch((error) => {
						// Auto-play was prevented
						// Show paused UI.
					});
				}
			} else {
				videoRef.current?.pause();
			}
		} catch (e) {
			console.warn('Weird play bug');
		}
	}, [entry]);

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
		if (props.onLoad) {
			props.onLoad();
		}
	};

	const setRefs = useCallback(
		(node: any) => {
			// Ref's from useRef needs to have the node assigned to `current`
			videoRef.current = node;
			// Callback refs, like the one from `useInView`, is a function that takes the node as an argument
			inViewRef(node);
		},
		[inViewRef],
	);

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
				return '100';
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
					ref={setRefs}
				></video>
			</>
		);
	}

	return (
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
			preload="metadata"
			style={style}
			ref={setRefs}
		>
			<source src={url + '.webm'} type="video/webm"></source>
			<source src={url + '.mp4'} type="video/mp4"></source>
			<source src={url + '.ogv'} type="video/ogg"></source>
		</video>
	);
};

export default React.memo(CloudinaryMedia);
