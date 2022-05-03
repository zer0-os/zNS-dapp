import { ArrowLink } from 'components';
import NFTMedia from 'components/NFTMedia';
import styles from './Preview.module.scss';

type PreviewProps = {
	title?: string;
	description?: string;
	icon?: string;
	banner?: string;
	href?: string;
};

const Preview = ({ title, description, icon, banner, href }: PreviewProps) => {
	return (
		<div className={styles.Container}>
			<NFTMedia
				alt="nft banner"
				className={styles.Banner}
				ipfsUrl={banner ?? ''}
				fit="cover"
				size="large"
				disableLightbox={true}
			/>
			<div className={styles.Content}>
				<NFTMedia
					alt="nft icon"
					className={styles.Icon}
					ipfsUrl={icon ?? ''}
					fit="cover"
					size="tiny"
					disableLightbox={true}
				/>
				<div className={styles.TextContainer}>
					{(title || description) && (
						<>
							<h1>{title}</h1>
							<p>{description}</p>
							{href && (
								<ArrowLink className={styles.Link} href={href} replace>
									View Domain NFT
								</ArrowLink>
							)}
						</>
					)}
				</div>
			</div>
		</div>
	);
};

export default Preview;
