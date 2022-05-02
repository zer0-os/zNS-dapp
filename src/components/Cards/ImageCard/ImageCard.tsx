import styles from './ImageCard.module.scss';
import { Image, NFTMedia, Spinner } from 'components';
import classNames from 'classnames/bind';
import { AspectRatio } from 'constants/aspectRatios';

const cx = classNames.bind(styles);

type ImageCardProps = {
	aspectRatio?: AspectRatio;
	children: React.ReactNode;
	imageUri?: string;
	header?: string;
	onClick?: (event?: any) => void;
	subHeader?: string;
	className?: string;
	shouldUseCloudinary?: boolean;
};

const ImageCard = ({
	aspectRatio,
	children,
	header,
	imageUri,
	onClick,
	subHeader,
	className,
	shouldUseCloudinary,
}: ImageCardProps) => {
	const aspectRatioClass = cx({
		Portrait: aspectRatio === AspectRatio.PORTRAIT,
		Landscape: aspectRatio === AspectRatio.LANDSCAPE,
	});

	return (
		<div
			className={cx(styles.Container, className, aspectRatioClass)}
			onClick={onClick}
		>
			<div className={styles.Body}>
				<div className={styles.Placeholder}>
					<div className={styles.Spinner}>
						<Spinner />
					</div>
				</div>
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
				<div className={styles.Subheader}>{subHeader ?? ''}</div>
				{children}
			</div>
		</div>
	);
};

export default ImageCard;
