import NFTMedia from 'components/NFTMedia';
import { Link } from 'react-router-dom';
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
				// src="https://res.cloudinary.com/fact0ry/image/upload/c_fill,h_120,q_60,w_120/v1/zns/QmPtAcgQFvzXHpteRUED7chUpkHK9qZ94LPumFLBJhfk1K"
			/>
			<div className={styles.Content}>
				<NFTMedia
					alt="nft icon"
					className={styles.Icon}
					ipfsUrl={icon ?? ''}
					fit="cover"
				/>
				<h1 className="glow-text-white">{title}</h1>
				<p>{description}</p>
				{href && <Link to={href}>View NFT Page</Link>}
			</div>
		</div>
	);
};

export default Preview;
