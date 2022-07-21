import styles from './ImageCard.module.scss';
import { Image, NFTMedia, OptionDropdown, Spinner, Tooltip } from 'components';
import classNames from 'classnames/bind';
import { AspectRatio } from 'constants/aspectRatios';
import moreIcon from 'assets/more-horizontal.svg';
import { Option } from 'components/Dropdowns/OptionDropdown/OptionDropdown';

const cx = classNames.bind(styles);

type ImageCardProps = {
	aspectRatio?: AspectRatio;
	children: React.ReactNode;
	imageUri?: string;
	header?: string;
	onClick?: (event?: any) => void;
	onSelectOption?: (option: Option) => void;
	actions?: Option[];
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
	onSelectOption,
	actions,
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
				<div className={styles.HeaderContainer}>
					<div className={styles.VerticalContainer}>
						<h5 className={styles.Header}>{header ?? ''}</h5>
						<div className={styles.Subheader}>{subHeader ?? ''}</div>
					</div>
				</div>
				{children}
			</div>
		</div>
	);
};

export default ImageCard;
