import { useState } from 'react';

import styles from './NFTMedia.module.css';

import { MediaContainerProps } from './types';

import { Image, Spinner } from 'components';

const IPFSMedia = (props: MediaContainerProps) => {
	const { className, style, alt, ipfsUrl, isVideo } = props;

	const [isLoading, setIsLoading] = useState<boolean>(true);

	const mediaClass = `${styles.Media} ${isLoading ? styles.Loading : ''}`;

	const onLoad = () => {
		setIsLoading(false);
	};

	return (
		<div className={styles.Container}>
			{isLoading && (
				<div className={styles.Spinner}>
					<Spinner />
				</div>
			)}
			{!isVideo && <img onLoad={onLoad} className={mediaClass} src={ipfsUrl} />}
			{isVideo && (
				<video onLoadedMetadata={onLoad} className={mediaClass} src={ipfsUrl} />
			)}
		</div>
	);
};

export default IPFSMedia;
