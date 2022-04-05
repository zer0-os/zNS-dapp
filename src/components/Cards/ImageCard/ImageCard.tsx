import styles from './ImageCard.module.scss';
import { Image } from 'components';
import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

type ImageCardProps = {
	children: React.ReactNode;
	imageUri?: string;
	header?: string;
	onClick?: () => void;
	subHeader?: string;
	className?: string;
};

const ImageCard = ({
	children,
	header,
	imageUri,
	onClick,
	subHeader,
	className,
}: ImageCardProps) => {
	return (
		<div className={cx(styles.Container, className)} onClick={onClick}>
			<div className={styles.Body}>
				<div className={styles.Image}>
					<Image src={imageUri} />
				</div>
			</div>
			<div className={styles.Footer}>
				<h5>{header ?? ''}</h5>
				<span>{subHeader ?? ''}</span>
				{children}
			</div>
		</div>
	);
};

export default ImageCard;
