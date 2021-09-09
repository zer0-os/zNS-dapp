import styles from './NFTMedia.module.css';

import { MediaContainerProps } from './types';

import { Image } from 'components';

const IPFSMedia = (props: MediaContainerProps) => {
	const { className, style, alt, ipfsUrl, isVideo } = props;

	return (
		<div className={styles.Container}>
			<Image
				className={`${styles.Media} ${className}`}
				style={style}
				src={ipfsUrl}
			/>
		</div>
	);
};

export default IPFSMedia;
