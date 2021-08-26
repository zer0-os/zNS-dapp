import { useState, useRef } from 'react';

import styles from './Media.module.css';

// @TODO: Refactor props to not by 'any' type
const IPFSMedia = (props: any) => {
	const [loaded, setLoaded] = useState(false);
	const [tryVideo, setTryVideo] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);

	const load = () => setLoaded(true);
	const err = (e: any) => {
		if (props.src) {
			setTryVideo(true);
		}
	};

	return <></>;

	// return (
	// 	<div
	// 		ref={containerRef}
	// 		style={{
	// 			position: 'relative',
	// 			width: '100%',
	// 			height: '100%',
	// 			display: 'inline-block',
	// 			...props.style,
	// 		}}
	// 	>
	// 		{!loaded && (
	// 			<div {...props} className={styles.Loading}>
	// 				<div className={styles.Spinner}></div>
	// 			</div>
	// 		)}
	// 		{!tryVideo && (
	// 			<img
	// 				{...props}
	// 				className={`${props.className ? props.className : ''} ${
	// 					styles.Image
	// 				}`}
	// 				style={{
	// 					opacity: loaded ? 1 : 0,
	// 					objectFit: 'cover',
	// 					...props.style,
	// 				}}
	// 				onLoad={load}
	// 				src={props.src}
	// 				alt={props.alt || ''}
	// 				onError={err}
	// 			/>
	// 		)}
	// 		{tryVideo && (
	// 			<video
	// 				{...props}
	// 				className={`${props.className ? props.className : ''} ${
	// 					styles.Image
	// 				} ${styles.Video}`}
	// 				style={{
	// 					opacity: loaded ? 1 : 0,
	// 					objectFit: 'cover',
	// 					...props.style,
	// 				}}
	// 				preload="metadata"
	// 				onLoadedMetadata={load}
	// 				controls={
	// 					containerRef &&
	// 					containerRef.current &&
	// 					containerRef.current.clientWidth > 100
	// 				}
	// 			/>
	// 		)}
	// 	</div>
	// );
};

export default IPFSMedia;
