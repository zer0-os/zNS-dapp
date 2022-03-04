// React Imports
import { useEffect, useRef, useState } from 'react';

// Component Imports
import {
	Detail,
	FutureButton,
	Member,
	NFTMedia,
	TextButton,
	Tooltip,
	OptionDropdown,
} from 'components';

// Container Imports
import { BuyNowButton, SetBuyNowButton } from 'containers';

// Asset Imports
import shareIcon from '../assets/share.svg';
import downloadIcon from '../assets/download.svg';
import background from '../assets/bg.jpeg';
import moreIcon from '../assets/more-vertical.svg';

// Style Imports
import styles from './NFT.module.scss';
import classNames from 'classnames/bind';

// Library Imports
import { toFiat } from 'lib/currency';

//- Type Imports
import { Option } from 'components/Dropdowns/OptionDropdown/OptionDropdown';

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
	yourBid?: number;
	isPriceDataLoading?: boolean;
	isMetadataLoading?: boolean;
	isDomainDataLoading?: boolean;
	wildPriceUsd?: number;
	account?: string;
	onTransfer?: () => void;
	isBiddable?: boolean;
	options: OptionType;
	onSelectOption: (option: Option) => void;
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
	onTransfer,
	isBiddable,
	options,
	onSelectOption,
}: NFTProps) => {
	const blobCache = useRef<string>();

	const [backgroundBlob, setBackgroundBlob] = useState<string | undefined>(
		blobCache.current,
	);

	const isOwnedByYou =
		account && owner && account.toLowerCase() === owner.toLowerCase();

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
			{!isOwnedByYou && (
				<Detail
					text={Amount(yourBid?.toLocaleString() ?? '-')}
					subtext={'Your Bid (WILD)'}
					bottomText={
						yourBid && wildPriceUsd
							? '$' + toFiat(wildPriceUsd * yourBid) + ' USD'
							: '-'
					}
				/>
			)}
		</div>
	);

	////////////
	// Render //
	////////////

	return (
		<div
			className={cx(styles.NFT, 'border-primary', {
				Loaded: true,
			})}
		>
			<div className={`${styles.Image}`}>
				<NFTMedia
					style={{
						objectFit: 'contain',
					}}
					alt="NFT Preview"
					ipfsUrl={assetUrl ?? ''}
					size="large"
				/>
			</div>
			<div className={styles.Info}>
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
				<div className={styles.Details}>
					<div>
						<h1 className="glow-text-white">{title ?? ''}</h1>
					</div>
					<div className={styles.Members}>
						<Member id={owner ?? ''} subtext={'Owner'} />
						<Member id={creator ?? ''} subtext={'Creator'} />
					</div>
					<div className={styles.Story}>{description ?? ''}</div>
					<div className={styles.Prices}>
						{BuyNowPrice()}
						{HighestBid()}
						<div className={styles.Break}></div>
						{YourBid()}
					</div>
					{isOwnedByYou && (
						<FutureButton
							glow={isOwnedByYou}
							onClick={onTransfer}
							className={styles.Transfer}
						>
							Transfer Ownership
						</FutureButton>
					)}
				</div>

				{backgroundBlob !== undefined && (
					<img
						alt="NFT panel background"
						src={backgroundBlob}
						className={styles.Bg}
					/>
				)}
			</div>
		</div>
	);
};

export default NFT;
