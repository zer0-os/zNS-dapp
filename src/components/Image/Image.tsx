import React, { useState, useRef, useEffect } from 'react';

import styles from './Image.module.scss';
// import placeholder from './'

// @TODO: Refactor props to not by 'any' type
const Image = (props: any) => {
	const [loaded, setLoaded] = useState(false);
	const [tryVideo, setTryVideo] = useState(false);
	const [src, setSrc] = useState<string | undefined>();

	const containerRef = useRef<HTMLDivElement>(null);

	const click = (e: any) => {
		if (!loaded || (tryVideo && props.controls)) {
			e.stopPropagation();
		} else {
			if (props.onClick) props.onClick();
		}
	};

	const load = () => setLoaded(true);
	const err = (e: any) => {
		if (props.src) {
			setTryVideo(true);
		}
	};

	useEffect(() => {
		setTryVideo(false);
		setLoaded(false);
		// Using src because it's possible for an
		// img to not register the onLoad if loading from
		// cache
		setSrc(props.src);
	}, [props.src]);

	return (
		<div
			ref={containerRef}
			style={{
				position: 'relative',
				width: '100%',
				height: '100%',
				maxHeight: 'inherit',
				...props.style,
			}}
			className={styles.Container}
			onClick={click}
		>
			{!loaded && (
				<div {...props} onClick={click} className={styles.Loading}>
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
					src={src}
					alt={props.alt || ''}
					onError={err}
					onClick={click}
				/>
			)}
			{tryVideo && (
				<video
					{...props}
					autoPlay={true}
					muted
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
					onClick={click}
				/>
			)}
		</div>
	);
};

export default React.memo(Image);
