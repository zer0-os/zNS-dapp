import styles from './ImageCard.module.scss';
import { Image, NFTMedia } from 'components';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

type ImageCardProps = {
	children: React.ReactNode;
	imageUri?: string;
	header?: string;
	onClick?: () => void;
	subHeader?: string;
	className?: string;
	shouldUseCloudinary?: boolean;
};

const ImageCard = ({
	children,
	header,
	imageUri,
	onClick,
	subHeader,
	className,
	shouldUseCloudinary,
}: ImageCardProps) => {
	return (
		<div className={cx(styles.Container, className)} onClick={onClick}>
			<div className={styles.Body}>
				<div className={styles.Image}>
					{shouldUseCloudinary ? (
						<NFTMedia
							disableLightbox
							style={{
								zIndex: 2,
							}}
							size="medium"
							alt="NFT Preview"
							ipfsUrl={imageUri ?? ''}
						/>
					) : (
						<Image src={imageUri} />
					)}
				</div>
			</div>
			<div className={styles.Footer}>
				<h5 className={styles.Header}>{header ?? ''}</h5>
				<span className={styles.Subheader}>{subHeader ?? ''}</span>
				{children}
			</div>
		</div>
	);
};

export default ImageCard;
