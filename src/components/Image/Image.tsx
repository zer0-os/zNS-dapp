import { useEffect, useState, useRef } from 'react';

import styles from './Image.module.css';

enum MediaType {
	Image,
	Video,
}

// Note:
// This component is being re-written in another
// branch - this is just a hotfix to get videos
// working on mobile
const Image = (props: any) => {
	const isMounted = useRef(false);
	const refVideo = useRef<HTMLVideoElement | undefined>(null);
	const [loaded, setLoaded] = useState(false);

	const [blobUrl, setBlobUrl] = useState<string | undefined>();
	const [mediaType, setMediaType] = useState<MediaType | undefined>();
	const [loadedSrc, setLoadedSrc] = useState<string | undefined>();
	const [loadingSrc, setLoadingSrc] = useState<string | undefined>();

	const containerRef = useRef<HTMLDivElement>(null);

	///////////////
	// Functions //
	///////////////

	const load = () => setLoaded(true);

	const getMediaType = (typeFromBlob: string) => {
		if (typeFromBlob.indexOf('image') > -1) {
			return MediaType.Image;
		} else if (typeFromBlob.indexOf('video') > -1) {
			return MediaType.Video;
		} else {
			return undefined;
		}
	};

	const click = (event: any) => {
		if (!loaded || props.controls) {
			event.stopPropagation();
		}
	};

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (
			!props.src ||
			props.src.length === 0 ||
			props.src === loadedSrc ||
			(loadingSrc && props.src === loadingSrc)
		) {
			return;
		}
		setLoaded(false);
		setLoadingSrc(props.src);
		fetch(props.src).then(async (r: Response) => {
			// Check that the URL hasn't switched between
			// making the fetch and receiving data
			if (r.url !== props.src || !isMounted.current) {
				return;
			}
			if (r.status !== 200) {
				throw 'Failed to retrieve media data at ' + props.src;
			}

			try {
				const blob = await r.blob();

				// Check again since we had an async call
				if (r.url !== props.src || !isMounted.current) {
					return;
				}

				const type = getMediaType(blob.type);
				const url = URL.createObjectURL(blob);
				if (!url || type === undefined) {
					throw 'Failed to create blob from IPFS url';
				}
				setMediaType(type);
				setBlobUrl(url);
				setLoaded(true);
				setLoadedSrc(r.url);
				setLoadingSrc(undefined);
			} catch (e: any) {
				console.error(e);
				return;
			}
		});
	}, [props.src]);

	////////////
	// Render //
	////////////

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
				<div {...props} className={styles.Loading}>
					<div className={styles.Spinner}></div>
				</div>
			)}
			{mediaType === MediaType.Image && (
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
					src={blobUrl}
					alt={props.alt || ''}
					onClick={click}
				/>
			)}
			{mediaType === MediaType.Video && (
				<video
					{...props}
					autoPlay="auto"
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
					src={blobUrl}
					preload="metadata"
					onLoadedMetadata={load}
					muted
					playsInline
					onClick={click}
				/>
			)}
		</div>
	);
};

export default Image;
