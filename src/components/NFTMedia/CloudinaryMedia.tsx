import React from 'react';

import styles from './NFTMedia.module.css';

import { CloudinaryMediaProps } from './types';

import { Spinner } from 'components';

import { Image, Video, Transformation } from 'cloudinary-react';
import { generateVideoPoster, cloudName, folder } from './config';
import { useState } from 'react';

const CloudinaryMedia = (props: CloudinaryMediaProps) => {
	const { style, alt, hash, size, isVideo, onLoad } = props;

	const getHeight = () => {
		switch (size as string) {
			case 'large':
				return '1000';
			case 'medium':
				return '500';
			case 'small':
				return '300';
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
				return 'c_fit,h_300,w_300';
			case 'tiny':
				return 'c_fit,h_50,w_50';
			default:
				return '';
		}
	};
	const crop = size !== undefined && cropOptions();

	return (
		<>
			{!isVideo && (
				<Image
					alt={alt}
					className={styles.Media}
					cloudName={cloudName}
					onLoad={onLoad}
					publicId={`${folder}/${hash}`}
					secure={true}
					style={style}
				>
					{height && (
						<Transformation height={height} width={height} crop="fit" />
					)}
				</Image>
			)}
			{isVideo && (
				<Video
					alt={alt}
					autoPlay={true}
					className={styles.Media}
					cloudName={cloudName}
					loop={true}
					muted
					onLoadedMetadata={onLoad}
					poster={generateVideoPoster(hash, crop as string)}
					preload="metadata"
					publicId={`${folder}/${hash}`}
					secure={true}
					style={style}
				>
					{height && (
						<Transformation width={height} height={height} crop="fit" />
					)}
				</Video>
			)}
		</>
	);
};

export default React.memo(CloudinaryMedia);
