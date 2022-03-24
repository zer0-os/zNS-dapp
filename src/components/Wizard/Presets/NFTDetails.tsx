import styles from './NFTDetails.module.scss';
import classNames from 'classnames';
import { Detail as DetailComponent, Member, NFTMedia } from 'components';
import { truncateDomain } from 'lib/utils';

const maxCharacterLength = 27;

type Detail = {
	name: string;
	value: string;
};

type NFTDetailsProps = {
	assetUrl: string;
	creator?: string;
	className?: string;
	domain: string;
	title: string;
	otherDetails?: Detail[];
};

const NFTDetails = ({
	assetUrl,
	creator,
	className,
	domain,
	title,
	otherDetails,
}: NFTDetailsProps) => {
	// Truncate domain
	const formattedDomain = truncateDomain(domain, maxCharacterLength);
	return (
		<div className={classNames(styles.Container, className)}>
			<NFTMedia
				alt="NFT Preview"
				className={classNames(styles.Image, 'img-border-rounded')}
				disableLightbox
				fit="cover"
				ipfsUrl={assetUrl}
				size="small"
			/>
			<div className={styles.Details}>
				<div>
					<h1 className="glow-text-white">{title}</h1>
					<h2>0://{formattedDomain}</h2>
				</div>
				{creator && <Member id={creator} subtext={'Creator'} />}
				{otherDetails?.map((detail: Detail, i) => (
					<DetailComponent
						key={i + detail.value}
						text={detail.value}
						subtext={detail.name}
					/>
				))}
			</div>
		</div>
	);
};

export default NFTDetails;
