// Component Imports
import { Detail, NFTMedia, Tooltip, OptionDropdown } from 'components';

// Asset Imports
import shareIcon from '../../assets/share.svg';
import downloadIcon from '../../assets/download.svg';
import moreIcon from '../../assets/more-vertical.svg';

// Style Imports
import styles from './NFT.module.scss';

// Library Imports
import { Bid } from '@zero-tech/zauction-sdk';

//- Type Imports
import { Option } from 'components/Dropdowns/OptionDropdown/OptionDropdown';
import { truncateWalletAddress } from 'lib/utils';
import BidButton from 'containers/buttons/BidButton/BidButton';

export const Amount = (amount: string) => (
	<span className={styles.Amount}>{amount}</span>
);

type OptionType = {
	icon: string;
	title: string;
}[];

type NFTProps = {
	domainId?: string;
	title?: string;
	creator?: string;
	owner?: string;
	assetUrl?: string;
	description?: string;
	buyNowPrice?: number;
	onMakeBid: () => void;
	onDownload?: () => void;
	onSuccessBuyNow?: () => void;
	onShare?: () => void;
	highestBid?: number;
	yourBid?: Bid;
	isPriceDataLoading?: boolean;
	isMetadataLoading?: boolean;
	isDomainDataLoading?: boolean;
	wildPriceUsd?: number;
	account?: string;
	isBiddable?: boolean;
	options: OptionType;
	onSelectOption: (option: Option) => void;
	onRefetch: () => void;
};

const NFT = ({
	domainId,
	title,
	creator,
	owner,
	assetUrl,
	description,
	buyNowPrice,
	isPriceDataLoading,
	onSuccessBuyNow,
	onDownload,
	onShare,
	highestBid,
	yourBid,
	wildPriceUsd,
	account,
	onMakeBid,
	isBiddable,
	options,
	onSelectOption,
	onRefetch,
}: NFTProps) => {
	////////////
	// Render //
	////////////

	return (
		<div className={styles.Container}>
			<div className={styles.Banner}>
				<NFTMedia alt="NFT Preview" ipfsUrl={assetUrl ?? ''} />
			</div>
			<h1>{title ?? ''}</h1>
			<div className="flex-split">
				<ul className={styles.Members}>
					<li>
						<Detail
							text={truncateWalletAddress(creator ?? '')}
							subtext={'Creator'}
						/>
					</li>
					<li>
						<Detail
							text={truncateWalletAddress(owner ?? '')}
							subtext={'Owner'}
						/>
					</li>
				</ul>
				<div className={styles.Tray}>
					<Tooltip text={'Share to Twitter'}>
						<button onClick={onShare}>
							<img src={shareIcon} alt="share asset" />
						</button>
					</Tooltip>
					<Tooltip text={'Download for Twitter'}>
						<button onClick={onDownload}>
							<img alt="download asset" src={downloadIcon} />
						</button>
					</Tooltip>
					{options.length > 0 && (
						<OptionDropdown
							onSelect={onSelectOption}
							options={options}
							className={styles.MoreDropdown}
						>
							<button>
								<img alt="more actions" src={moreIcon} />
							</button>
						</OptionDropdown>
					)}
				</div>
			</div>
			<p>{description ?? ''}</p>
			<Detail
				text={'-'}
				subtext={'Highest Bid'}
				bottomText={'No bids placed'}
			/>
			<BidButton glow onClick={onMakeBid}>
				Make A Bid
			</BidButton>
		</div>
	);
};

export default NFT;
