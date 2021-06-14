import { useState, useRef } from 'react';

import styles from './Image.module.css';
// import placeholder from './'

// @TODO: Refactor props to not by 'any' type
const Image = (props: any) => {
	const [loaded, setLoaded] = useState(false);
	const [tryVideo, setTryVideo] = useState(false);

	const containerRef = useRef<HTMLDivElement>(null);

	const load = () => setLoaded(true);
	const err = () => {
		if (props.src) {
			setTryVideo(true);
		}
	};

	return (
		<div
			ref={containerRef}
			style={{
				position: 'relative',
				width: '100%',
				height: '100%',
				display: 'inline-block',
				...props.style,
			}}
		>
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
					controls={
						containerRef &&
						containerRef.current &&
						containerRef.current.clientWidth > 100
					}
				/>
			)}
			{!loaded && (
				<div {...props} className={styles.Loading}>
					<div className={styles.Spinner}></div>
				</div>
			)}
		</div>
	);
};

export default Image;
