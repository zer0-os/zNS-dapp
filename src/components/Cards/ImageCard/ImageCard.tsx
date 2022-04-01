import styles from './ImageCard.module.scss';
import { Image } from 'components';

type ImageCardProps = {
	children: React.ReactNode;
	imageUri?: string;
	header?: string;
	onClick?: (event?: any) => void;
	subHeader?: string;
};

const ImageCard = ({
	children,
	header,
	imageUri,
	onClick,
	subHeader,
}: ImageCardProps) => {
	return (
		<div className={styles.Container} onClick={onClick}>
			<div className={styles.Image}>
				<Image src={imageUri} />
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
