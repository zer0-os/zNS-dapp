import { useState } from 'react';

import styles from './NFTMedia.module.css';

import { MediaContainerProps } from './types';

import { Image, Spinner } from 'components';

const IPFSMedia = (props: MediaContainerProps) => {
	const { className, style, alt, ipfsUrl, isVideo, onLoad } = props;

	return (
		<>
			{!isVideo && (
				<img onLoad={onLoad} className={styles.Media} src={ipfsUrl} />
			)}
			{isVideo && (
				<video
					onLoadedMetadata={onLoad}
					className={styles.Media}
					src={ipfsUrl}
				/>
			)}
		</>
	);
};

export default IPFSMedia;
