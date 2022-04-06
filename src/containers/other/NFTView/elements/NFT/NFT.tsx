//- Component Imports
import { Detail, NFTMedia, Tooltip, OptionDropdown } from 'components';

//- Asset Imports
import shareIcon from '../../assets/share.svg';
import downloadIcon from '../../assets/download.svg';
import moreIcon from '../../assets/more-vertical.svg';

//- Style Imports
import styles from './NFT.module.scss';

//- Library Imports
import { truncateWalletAddress } from 'lib/utils';
import { Domain } from '@zero-tech/zns-sdk/lib/types';
import { Bid } from '@zero-tech/zauction-sdk';
import { Maybe, Metadata } from 'lib/types';

//- Constants Imports
import { NFT_MORE_ACTIONS_TITLE } from '../../NFTView.constants';

//- Type Imports
import { Option } from 'components/Dropdowns/OptionDropdown/OptionDropdown';

//- NFTView Modal Provider Imports
import { useNFTViewModal } from '../../hooks';
import { NFTViewModalType } from '../../providers/NFTViewModalProvider/NFTViewModalProvider.types';

export const Amount = (amount: string) => (
	<span className={styles.Amount}>{amount}</span>
);

type OptionType = {
	icon: string;
	title: string;
}[];

type NFTProps = {
	bids: Bid[];
	domainMetadata?: Maybe<Metadata>;
	owner: string;
	title: string;
	domainId: string;
	assetUrl: string;
	creator: string;
	options: OptionType;
	wildPriceUsd: number;
	description?: string;
	isLoading?: boolean;
	highestBid?: string;
	viewBidsDomainData?: Domain;
	refetch: () => void;
	onTransfer: () => void;
	onDownload?: () => void;
	onShare?: () => void;
};

const NFT = ({
	bids,
	domainMetadata,
	owner,
	title,
	domainId,
	assetUrl,
	creator,
	options,
	wildPriceUsd,
	description,
	isLoading,
	highestBid,
	viewBidsDomainData,
	refetch,
	onTransfer,
	onDownload,
	onShare,
}: NFTProps) => {
	//- Modal Provider Hook
	const { openModal, closeModal } = useNFTViewModal();

	///////////////
	// Functions //
	///////////////

	// Open Domain Settings Modal
	const openDomainSettings = () => {
		openModal({
			modalType: NFTViewModalType.DOMAIN_SETTINGS,
			contentProps: {
				domainId: domainId,
				onClose: closeModal,
			},
		});
	};

	// Open Domain Settings Modal
	const openSetBuyNow = () => {
		openModal({
			modalType: NFTViewModalType.SET_BUY_NOW,
			contentProps: {
				domainId: domainId,
				onCancel: closeModal,
				onSuccess: refetch,
			},
		});
	};

	const handleOnAccept = () => {
		refetch();
		closeModal();
	};

	// Open Bid List Modal
	const openBidList = () => {
		openModal({
			modalType: NFTViewModalType.BID_LIST,
			contentProps: {
				bids: bids,
				domain: viewBidsDomainData,
				domainMetadata: domainMetadata ?? undefined,
				onAccept: handleOnAccept,
				wildPriceUsd,
				isLoading,
				highestBid,
			},
		});
	};

	// Dropdown Option Select
	const onSelectOption = (option: Option) => {
		if (option.title === NFT_MORE_ACTIONS_TITLE.MY_DOMAIN_SETTINGS) {
			openDomainSettings();
		} else if (option.title === NFT_MORE_ACTIONS_TITLE.TRANSFER_OWNERSHIP) {
			onTransfer();
		} else if (option.title === NFT_MORE_ACTIONS_TITLE.SET_BUY_NOW) {
			openSetBuyNow();
		} else {
			openBidList();
		}
	};

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
		</div>
	);
};

export default NFT;
