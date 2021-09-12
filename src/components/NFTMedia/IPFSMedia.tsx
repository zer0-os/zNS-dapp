import { useState } from 'react';

import styles from './NFTMedia.module.css';

import { MediaContainerProps } from './types';

import { Image, Spinner } from 'components';

const IPFSMedia = (props: MediaContainerProps) => {
	const { style, alt, ipfsUrl, isVideo, onLoad, size } = props;

	const clickVideo = (e: any) => {
		if (size === undefined) {
			e.stopPropagation();
		} else if (props.onClick) {
			props.onClick();
		}
	};

	return (
		<>
			{!isVideo && (
				<img
					alt={alt}
					style={style}
					onClick={props.onClick}
					onLoad={onLoad}
					className={styles.Media}
					src={ipfsUrl}
				/>
			)}
			{isVideo && (
				<video
					style={style}
					autoPlay
					controls={size === undefined}
					onClick={clickVideo}
					muted
					onLoadedMetadata={onLoad}
					className={styles.Media}
					src={ipfsUrl}
				/>
			)}
		</>
	);
};

export default IPFSMedia;
