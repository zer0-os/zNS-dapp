//- Styles Imports
import styles from './NFTDetails.module.scss';

//- Library Imports
import classNames from 'classnames';
import { truncateDomain } from 'lib/utils';
import { DomainBidData } from 'lib/utils/bids';

//- Constants Imports
import { LABELS } from 'constants/labels';

//- Component Imports
import {
	Detail as DetailComponent,
	Member,
	NFTMedia,
	TextButton,
} from 'components';

const maxCharacterLength = 28;

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
	hasViewAllBids?: boolean;
	bidData?: DomainBidData | undefined;
	setIsModalOpen?: (state: boolean) => void;
};

const NFTDetails = ({
	assetUrl,
	creator,
	className,
	domain,
	title,
	otherDetails,
	hasViewAllBids = false,
	bidData,
	setIsModalOpen,
}: NFTDetailsProps) => {
	///////////////
	// Functions //
	///////////////

	// Conditionally set "all bids modal" state
	const showAllBidsModal = () => {
		if (bidData?.bids.length && setIsModalOpen) {
			setIsModalOpen(true);
		}
	};

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
				{hasViewAllBids && (
					<TextButton
						className={styles.ViewAll}
						style={{
							opacity: bidData?.bids.length ? 1 : 0.5,
							cursor: bidData?.bids.length ? 'pointer' : 'default',
						}}
						onClick={showAllBidsModal}
					>
						{LABELS.VIEW_ALL_BIDS}
					</TextButton>
				)}
			</div>
		</div>
	);
};

export default NFTDetails;
