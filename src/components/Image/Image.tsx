import { useEffect, useState, useRef } from 'react';

import styles from './Image.module.css';
// import placeholder from './'

// @TODO: Refactor props to not by 'any' type
const Image = (props: any) => {
	const refVideo = useRef<HTMLVideoElement | undefined>(null);
	const [loaded, setLoaded] = useState(false);
	const [tryVideo, setTryVideo] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);

	const load = () => setLoaded(true);
	const err = (e: any) => {
		if (props.src) {
			setTryVideo(true);
		}
	};

	useEffect(() => {
		if (!refVideo.current) {
			return;
		}

		if (props.unmute) {
			refVideo.current.defaultMuted = false;
			refVideo.current.muted = false;
		} else {
			refVideo.current.defaultMuted = true;
			refVideo.current.muted = true;
		}
	}, [tryVideo, props.unmute]);

	return (
		<div
			ref={containerRef}
			style={{
				position: 'relative',
				width: '100%',
				height: '100%',
				display: 'inline-block',
				maxHeight: 'inherit',
				...props.style,
			}}
		>
			{!loaded && (
				<div {...props} className={styles.Loading}>
					<div className={styles.Spinner}></div>
				</div>
			)}
			{!tryVideo && (
				<img
					{...props}
					className={`${props.className ? props.className : ''} ${
						styles.Image
					}`}
					style={{
						opacity: loaded ? 1 : 0,
						objectFit: 'cover',
						...props.style,
					}}
					onLoad={load}
					src={props.src}
					alt={props.alt || ''}
					onError={err}
				/>
			)}
			{tryVideo && (
				<video
					{...props}
					autoPlay
					loop
					ref={refVideo}
					className={`${props.className ? props.className : ''} ${
						styles.Image
					} ${styles.Video}`}
					style={{
						opacity: loaded ? 1 : 0,
						objectFit: 'cover',
						...props.style,
					}}
					preload="metadata"
					onLoadedMetadata={load}
					playsInline
				/>
			)}
		</div>
	);
};

export default Image;
