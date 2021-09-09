import styles from './NFTMedia.module.css';

import { CloudinaryMediaProps } from './types';

import { Image, Video, Transformation } from 'cloudinary-react';

const Cloudinary = {
	cloudName: 'fact0ry',
	preHash: '/zns/',
};

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

	return (
		<div className={`${styles.Container} ${className}`}>
			{!isVideo && (
				<Image
					className={styles.Media}
					cloudName={Cloudinary.cloudName}
					secure={true}
					publicId={Cloudinary.preHash + hash}
				>
					{height && (
						<Transformation height={height} width={height} crop="fit" />
					)}
				</Image>
			)}
			{isVideo && (
				<Video
					className={styles.Media}
					cloudName={Cloudinary.cloudName}
					secure={true}
					publicId={Cloudinary.preHash + hash}
					loop={true}
					controls={true}
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
