// React Imports
import { useEffect, useRef, useState } from 'react';

// Component Imports
import {
	Detail,
	Member,
	NFTMedia,
	TextButton,
	Tooltip,
	OptionDropdown,
} from 'components';

// Container Imports
import { BuyNowButton, SetBuyNowButton } from 'containers';

// Asset Imports
import shareIcon from '../../assets/share.svg';
import downloadIcon from '../../assets/download.svg';
import background from '../../assets/bg.jpeg';
import moreIcon from '../../assets/more-vertical.svg';

// Style Imports
import styles from './NFT.module.scss';
import classNames from 'classnames/bind';

// Library Imports
import { toFiat } from 'lib/currency';
import { Bid } from '@zero-tech/zauction-sdk';
import { ethers } from 'ethers';
import CancelBidButton from 'containers/flows/CancelBid/CancelBidButton';

//- Type Imports
import { Option } from 'components/Dropdowns/OptionDropdown/OptionDropdown';
import { truncateAddress } from 'lib/utils';
import BidButton from 'containers/buttons/BidButton/BidButton';

export const Amount = (amount: string) => (
	<span className={styles.Amount}>{amount}</span>
);

const cx = classNames.bind(styles);

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
	const blobCache = useRef<string>();

	const [backgroundBlob, setBackgroundBlob] = useState<string | undefined>(
		blobCache.current,
	);

	const isOwnedByYou =
		account && owner && account.toLowerCase() === owner.toLowerCase();

	const yourBidAsNumber = yourBid
		? Number(ethers.utils.formatEther(yourBid.amount))
		: undefined;

	// Load background
	useEffect(() => {
		let isMounted = true;
		fetch(background)
			.then((r) => r.blob())
			.then((blob) => {
				const url = URL.createObjectURL(blob);
				blobCache.current = url;
				if (isMounted) {
					setBackgroundBlob(url);
				}
			});
		return () => {
			isMounted = false;
		};
	}, []);

	///////////////
	// Fragments //
	///////////////

	const BuyNowPrice = () => (
		<div>
			<Detail
				text={Amount(
					(buyNowPrice ?? 0) > 0
						? buyNowPrice!.toLocaleString()
						: isPriceDataLoading
						? '-'
						: 'No price set',
				)}
				subtext={'Buy Now Price (WILD)'}
				bottomText={
					buyNowPrice && wildPriceUsd
						? '$' + toFiat(wildPriceUsd * buyNowPrice) + ' USD'
						: '-'
				}
			/>
			{account && (
				<>
					{isOwnedByYou ? (
						<SetBuyNowButton
							onSuccess={onSuccessBuyNow}
							buttonText="Edit Buy Now"
							domainId={domainId ?? ''}
							isTextButton
							className={styles.SetBuyNow}
						/>
					) : (
						<BuyNowButton
							onSuccess={onSuccessBuyNow}
							buttonText="Buy Now"
							disabled={(buyNowPrice ?? 0) === 0}
							domainId={domainId ?? ''}
						/>
					)}
				</>
			)}
		</div>
	);

	const HighestBid = () => (
		<div>
			<Detail
				text={Amount(
					highestBid
						? highestBid.toLocaleString()
						: isPriceDataLoading
						? '-'
						: 'No bids',
				)}
				subtext={'Highest Bid (WILD)'}
				bottomText={
					highestBid && wildPriceUsd
						? '$' + toFiat(wildPriceUsd * highestBid) + ' USD'
						: '-'
				}
			/>
			{account && !isOwnedByYou && isBiddable && (
				<TextButton className={styles.Action} onClick={onMakeBid}>
					Make A Bid
				</TextButton>
			)}
		</div>
	);

	const YourBid = () => (
		<div>
			<Detail
				text={Amount(yourBidAsNumber!.toLocaleString() ?? '-')}
				subtext={'Your Bid (WILD)'}
				bottomText={
					wildPriceUsd
						? '$' + toFiat(wildPriceUsd * yourBidAsNumber!) + ' USD'
						: '-'
				}
			/>
			<CancelBidButton
				className={styles.Action}
				isTextButton
				auctionId={yourBid!.auctionId}
				domainId={domainId!}
				onSuccess={onRefetch}
			/>
		</div>
	);

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
						<Detail text={truncateAddress(creator ?? '')} subtext={'Creator'} />
					</li>
					<li>
						<Detail text={truncateAddress(owner ?? '')} subtext={'Owner'} />
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
