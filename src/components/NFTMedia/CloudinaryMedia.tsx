import styles from './NFTMedia.module.css';

import { CloudinaryMediaProps } from './types';

import { Image, Video, Transformation } from 'cloudinary-react';
import { generateVideoPoster, cloudName, folder } from './config';

const CloudinaryMedia = (props: CloudinaryMediaProps) => {
	const { className, style, alt, hash, size, isVideo } = props;

	const getHeight = () => {
		switch (size as string) {
			case 'large':
				return '1000';
			case 'medium':
				return '500';
			case 'small':
				return '200';
			case 'tiny':
				return '50';
			default:
				return undefined;
		}
	};
	const height = size !== undefined && getHeight();

	// For some reason, Cloudinary SDK isn't
	// applying the crop options to the poster,
	// so I'm adding them manually
	const cropOptions = () => {
		switch (size as string) {
			case 'large':
				return 'c_fit,h_1000,w_1000';
			case 'medium':
				return 'c_fit,h_500,w_500';
			case 'small':
				return 'c_fit,h_200,w_200';
			case 'tiny':
				return 'c_fit,h_50,w_50';
			default:
				return '';
		}
	};
	const crop = size !== undefined && cropOptions();

	return (
		<div className={`${styles.Container} ${className}`}>
			{!isVideo && (
				<Image
					className={styles.Media}
					cloudName={cloudName}
					secure={true}
					publicId={`${folder}/${hash}`}
				>
					{height && (
						<Transformation height={height} width={height} crop="fit" />
					)}
				</Image>
			)}
			{isVideo && (
				<Video
					className={styles.Media}
					cloudName={cloudName}
					secure={true}
					publicId={`${folder}/${hash}`}
					autoPlay={true}
					poster={generateVideoPoster(hash, crop as string)}
					muted
					loop={true}
					preload="metadata"
				>
					{height && (
						<Transformation width={height} height={height} crop="fit" />
					)}
				</Video>
			)}
		</div>
	);
};

export default CloudinaryMedia;
