import { useState } from 'react';

import styles from './NFTMedia.module.css';

import { MediaContainerProps } from './types';

import { Image, Spinner } from 'components';

const IPFSMedia = (props: MediaContainerProps) => {
	const { style, alt, ipfsUrl, isVideo, onLoad, size } = props;

	return (
		<>
			{!isVideo && (
				<img
					alt={alt}
					style={style}
					onLoad={onLoad}
					className={styles.Media}
					src={ipfsUrl}
				/>
			)}
			{isVideo && (
				<video
					style={style}
					autoPlay
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
