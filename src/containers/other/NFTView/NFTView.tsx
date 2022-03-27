/*
 * This file is a behemoth, and needs to be broken down
 * into smaller components.
 */

//- React Imports
import React, { useMemo, useState, useEffect, useRef } from 'react';
import { Spring, animated } from 'react-spring';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core'; // Wallet data
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'; // Wallet data
import { BigNumber, ethers } from 'ethers';

//- Component Imports
import { ArrowLink, Overlay, StatsWidget } from 'components';
import { MakeABid } from 'containers';
import { DomainSettings } from './elements';

//- Library Imports
import NFT from './components/NFT';
import HistoryItem from './components/HistoryItem';

//- Library Imports
import useNotification from 'lib/hooks/useNotification';
import useCurrency from 'lib/hooks/useCurrency';
import { toFiat } from 'lib/currency';
import { chainIdToNetworkType, getEtherscanUri } from 'lib/network';
import { Attribute } from 'lib/types';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';
import { Bid } from '@zero-tech/zauction-sdk';
import {
	DomainBidEvent,
	DomainEvent,
	DomainMetrics,
} from '@zero-tech/zns-sdk/lib/types';
import useMatchMedia from 'lib/hooks/useMatchMedia';
import { getHashFromIPFSUrl, getWebIPFSUrlFromHash } from 'lib/ipfs';
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';

//- Type Imports
import { Option } from 'components/Dropdowns/OptionDropdown/OptionDropdown';

//- Style Imports
import styles from './NFTView.module.scss';

//- Asset Imports
import copyIcon from './assets/copy-icon.svg';
import settingsIcon from './assets/settings.svg';
import dollarSignIcon from './assets/dollar-sign.svg';
import transferOwnershipIcon from './assets/transfer.svg';

//- Constants Imports
import { MORE_ACTION_KEY } from './NFTView.constants';
import { useZAuctionSdk } from 'lib/providers/ZAuctionSdkProvider';

const MORE_ACTIONS = [
	{
		icon: settingsIcon,
		title: MORE_ACTION_KEY.MY_DOMAIN_SETTINGS,
	},
	{
		icon: transferOwnershipIcon,
		title: MORE_ACTION_KEY.TRANSFER_OWNERSHIP,
	},
	{
		icon: dollarSignIcon,
		title: MORE_ACTION_KEY.VIEW_BIDS,
	},
];

const ZNS_SHARE_BASE_URL = process.env.REACT_APP_ZNS_SHARE_BASE_URL as string;

const sortBids = (bids: Bid[]) => {
	return bids.sort(
		(a, b) =>
			Number(ethers.utils.formatEther(b.amount)) -
			Number(ethers.utils.formatEther(a.amount)),
	);
};

type NFTViewProps = {
	onTransfer: () => void;
};

// @todo refactor on next iterations
export interface DomainEvents extends DomainEvent {
	from?: string;
	to?: string;
	minter?: string;
	buyer?: string;
	seller?: string;
	amount?: string;
	bidder?: string;
}

const NFTView: React.FC<NFTViewProps> = ({ onTransfer }) => {
	const isMounted = useRef(false);
	const { addNotification } = useNotification();
	const { wildPriceUsd } = useCurrency();

	const isMobile = useMatchMedia('phone');
	const isTabletPortrait = useMatchMedia('(max-width: 768px)');
	const isMobilePortrait = useMatchMedia('(max-width: 520px)');

	//- Page State
	const [isPriceDataLoading, setIsPriceDataLoading] = useState<boolean>();
	const [isBidOverlayOpen, setIsBidOverlayOpen] = useState(false);
	const [allItems, setAllItems] = useState<DomainEvent[] | undefined>();
	const [highestBid, setHighestBid] = useState<Bid | undefined>();
	const [buyNowPrice, setBuyNowPrice] = useState<number | undefined>();
	const [yourBid, setYourBid] = useState<Bid | undefined>();
	const [tradeData, setTradeData] = useState<DomainMetrics | undefined>();
	const [bids, setBids] = useState<DomainBidEvent[] | undefined>();
	const [statsLoaded, setStatsLoaded] = useState(false);
	const [isShowMoreAtrributes, setIsShowMoreAttributes] =
		useState<boolean>(false);
	const [containerHeight, setContainerHeight] = useState(0);
	const [ipfsHash, setIpfsHash] = useState<string>('');
	const [isDomainSettingsOpen, setIsDomainSettingsOpen] =
		useState<Boolean>(false);

	const {
		domainId,
		domain: znsDomain,
		domainMetadata,
		domainRaw: domain,
	} = useCurrentDomain();
	const isBiddable = Boolean(domainMetadata?.isBiddable);

	//- Web3 Domain Data
	// const domainId = getDomainId(domain.substring(1));
	const domainIdInteger = BigNumber.from(domainId); //domainId as bignumber used to redirect to etherscan link

	// const znsDomain = useZnsDomain(domainId);

	//- Web3 Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { account, active, chainId } = walletContext;

	const networkType = chainIdToNetworkType(chainId);

	const etherscanBaseUri = getEtherscanUri(networkType);
	const etherscanLink = `${etherscanBaseUri}token/${
		znsDomain?.contract
	}?a=${domainIdInteger.toString()}`;

	const isOwnedByYou =
		znsDomain?.owner.id.toLowerCase() === account?.toLowerCase();

	const sdk = useZnsSdk();
	const { instance: zAuctionInstance } = useZAuctionSdk();
	//Transfers and mint data from nft
	//- Calls the hook with a polling interval to update the data

	//- Functions
	const copyToClipboard = (content: string, label: string) => {
		addNotification(`Copied ${label} to clipboard.`);
		try {
			navigator?.clipboard?.writeText(content);
		} catch (e) {
			console.error(e);
		}
	};

	const truncateText = (
		text: string,
		startLength: number,
		endLength: number = 4,
	) => {
		const stringLength = text.length;
		return `${text.slice(0, startLength)}...${text.slice(
			stringLength - endLength,
		)}`;
	};

	const downloadAsset = async () => {
		// @todo move this into a helper
		if (znsDomain?.animation_url || znsDomain?.image_full || znsDomain?.image) {
			// Get hash from asset

			const url = (znsDomain.animation_url ||
				znsDomain.image_full ||
				znsDomain.image)!;
			let hash: string;
			if (url.startsWith('ipfs://')) {
				// ipfs://
				hash = url.slice(7);
			} else {
				// http(s)://
				const hashIndex = url.lastIndexOf('/') + 1;
				hash = url.slice(hashIndex);
			}

			const checkUrl = (url: string) => {
				return new Promise((resolve, reject) => {
					fetch(url, { method: 'HEAD' }).then((r) => {
						if (r.ok) {
							resolve(url);
						} else {
							reject();
						}
					});
				});
			};

			try {
				const asset = await Promise.any([
					checkUrl(
						`https://res.cloudinary.com/fact0ry/video/upload/c_fit,h_900,w_900,fps_1-24,f_mp4,vc_h264,ac_aac/v1631501273/zns/${hash}.mp4`,
					),
					checkUrl(
						`https://res.cloudinary.com/fact0ry/image/upload/c_fit,h_1900,w_1200,q_auto/v1631501273/zns/${hash}.jpg`,
					),
				]);
				if (typeof asset !== 'string') {
					return;
				}
				addNotification('Download starting');
				fetch(asset, {
					method: 'GET',
				})
					.then((response) => {
						response.arrayBuffer().then(function (buffer) {
							const url = window.URL.createObjectURL(new Blob([buffer]));
							const link = document.createElement('a');
							link.href = url;
							link.setAttribute(
								'download',
								asset.split('/')[asset.split('/').length - 1],
							);
							document.body.appendChild(link);
							link.click();
							link.remove();
						});
					})
					.catch((err) => {
						console.error(err);
					});
			} catch (e) {
				console.error(e);
			}
		}
	};

	const shareAsset = () => {
		const url = `${ZNS_SHARE_BASE_URL}/${domain}`;
		window.open(
			`https://twitter.com/share?url=
				${encodeURIComponent(url)}`,
			'',
			'menubar=no,toolbar=no,resizable=no,scrollbars=no,personalbar=no,height=575,width=500',
		);
		return false;
	};

	const openBidOverlay = () => {
		if (!isMounted.current) return;
		if (!znsDomain || isOwnedByYou || !active) return;
		setIsBidOverlayOpen(true);
	};

	const closeBidOverlay = () => {
		setIsBidOverlayOpen(false);
	};

	const onBid = async () => {
		getPriceData();
		getHistory();
		closeBidOverlay();
	};

	const getHistory = async () => {
		if (znsDomain) {
			try {
				const events = await sdk.instance?.getDomainEvents(znsDomain.id);

				const bids = events.filter((e) => e.type === 2) as DomainBidEvent[];
				setBids(bids);

				if (!isMounted.current) return;
				setAllItems(events);
			} catch (e) {
				console.error('Failed to retrieve bid data');
			}
		}
	};

	const getPriceData = async () => {
		if (!znsDomain?.id) {
			return;
		}
		const { id } = znsDomain;
		setIsPriceDataLoading(true);
		setBuyNowPrice(undefined);
		setHighestBid(undefined);
		setYourBid(undefined);
		try {
			// // Get buy now and all bids
			const [listing, bids] = await Promise.all([
				zAuctionInstance.getBuyNowPrice(id),
				zAuctionInstance.listBids([id]),
			]);

			const buyNow = listing.price;

			// Excuse this monstrosity
			const highestBid = sortBids(bids[id])[0];

			if (account) {
				const yourBid = sortBids(
					bids[id].filter(
						(b) => b.bidder.toLowerCase() === account.toLowerCase(),
					),
				)[0];
				if (yourBid) {
					setYourBid(yourBid);
				}
			}

			setHighestBid(highestBid);
			setBuyNowPrice(Number(ethers.utils.formatEther(buyNow)));
			setIsPriceDataLoading(false);
		} catch (e) {
			console.error('Failed to retrieve bid data');
		}
	};

	const getTradeData = async () => {
		if (znsDomain) {
			const data = await sdk.instance.getDomainMetrics([znsDomain.id]);
			setTradeData(data[znsDomain.id]);
			setStatsLoaded(true);
		}
	};

	//This functions checks the width of current screen and then return a number to set the list of attributes length
	const setAttributesListLength = (): number => {
		const isTablet = window.innerWidth > 414 && window.innerWidth < 768;
		const isMobile = window.innerWidth <= 414;
		if (isTablet) return 7;
		else if (isMobile) return 5;
		else return 11;
	};

	const toggleAttributes = () => setIsShowMoreAttributes((prev) => !prev);

	//Checks the height of attributes container
	const checkHeight = () => {
		if (isShowMoreAtrributes) setContainerHeight(10);
		else setContainerHeight(0);
	};

	useEffect(() => {
		checkHeight();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isShowMoreAtrributes]);

	const moreOptions = useMemo(() => {
		const isOwnedByMe =
			znsDomain?.owner.id.toLowerCase() === account?.toLowerCase();
		/* Hide for now (2022/02/22)
		 * TODO:: Should decide to check lockership or not

			const isLocked = znsDomain?.isLocked;
			const isLockedByMe = isLocked
				? znsDomain?.lockedBy.id.toLowerCase() === account?.toLowerCase()
				: isOwnedByMe;
		 */

		if (isOwnedByMe) {
			// only show my domain settings action for now
			return MORE_ACTIONS.slice(0, 2);
		}

		return [];
	}, [znsDomain, account]);

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		isMounted.current = true;
		if (znsDomain) {
			getPriceData();
			getHistory();
			getTradeData();
			setIpfsHash(getHashFromIPFSUrl(znsDomain.metadata));
		}
		return () => {
			isMounted.current = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [znsDomain, account]);

	const nftStats = () => {
		let width = '24.2%';
		if (isMobilePortrait) {
			width = '100%';
		} else if (isTabletPortrait) {
			width = '32%';
		}
		const data = [
			{
				fieldName: 'Top Bid',
				title: `${
					tradeData?.highestBid
						? Number(
								ethers.utils.formatEther(tradeData?.highestBid),
						  ).toLocaleString()
						: 0
				} WILD`,
				subTitle:
					wildPriceUsd > 0
						? `$${
								tradeData?.highestBid
									? toFiat(
											Number(ethers.utils.formatEther(tradeData?.highestBid)) *
												wildPriceUsd,
									  )
									: 0
						  }`
						: '',
			},
			{
				fieldName: 'Bids',
				title: bids?.length ? bids.length.toLocaleString() : '0',
				isHidden: isMobile || isTabletPortrait || isMobilePortrait,
			},
			{
				fieldName: 'Last Sale',
				title: `${
					tradeData?.lastSale
						? Number(
								ethers.utils.formatEther(tradeData?.lastSale),
						  ).toLocaleString()
						: 0
				} WILD`,
				subTitle:
					wildPriceUsd > 0
						? `$${
								tradeData?.lastSale
									? toFiat(
											Number(ethers.utils.formatEther(tradeData?.lastSale)) *
												wildPriceUsd,
									  )
									: 0
						  }`
						: '',
			},
			{
				fieldName: 'Volume',
				title: (tradeData?.volume as any)?.all
					? `${Number(
							ethers.utils.formatEther((tradeData?.volume as any)?.all),
					  ).toLocaleString()} WILD`
					: '',
				subTitle:
					wildPriceUsd > 0
						? `$${
								(tradeData?.volume as any)?.all
									? toFiat(
											Number(
												ethers.utils.formatEther(
													(tradeData?.volume as any)?.all,
												),
											) * wildPriceUsd,
									  )
									: 0
						  }`
						: '',
			},
		];

		return (
			<>
				<div className={styles.Stats}>
					{data.map(
						(item, index) =>
							!item.isHidden && (
								<div
									key={`stats-widget-${index}`}
									className={styles.WidgetContainer}
									style={{
										width: width,
									}}
								>
									<StatsWidget
										title={item.title}
										fieldName={item.fieldName}
										subTitle={item.subTitle}
										isLoading={!statsLoaded || !allItems}
										className="previewView"
									></StatsWidget>
								</div>
							),
					)}
				</div>
			</>
		);
	};

	const overlays = () => {
		if (!znsDomain?.id) {
			return;
		}
		return (
			<Overlay onClose={closeBidOverlay} open={isBidOverlayOpen}>
				<MakeABid domain={znsDomain} onBid={onBid} />
			</Overlay>
		);
	};

	const history = () => {
		// Sort all history items
		const allHistoryItems = allItems?.sort(
			(a: DomainEvents, b: DomainEvents) => {
				const aVal = a.bidder
					? Number(a.timestamp)
					: Number(a.timestamp) * 1000;
				const bVal = b.bidder
					? Number(b.timestamp)
					: Number(b.timestamp) * 1000;
				return bVal - aVal;
			},
		);

		return (
			<section
				className={`${styles.History} ${styles.Box} border-primary border-rounded background-primary`}
			>
				<h4>History</h4>
				{!allItems && (
					<div className={styles.Loading}>
						<span>Loading domain history</span>
					</div>
				)}
				{allHistoryItems && allHistoryItems.length > 0 && (
					<ul>
						{allHistoryItems.map((item: DomainEvent, i: number) => (
							<div key={i}>
								<HistoryItem item={item} />
							</div>
						))}
					</ul>
				)}
			</section>
		);
	};

	const attributesList = (attribute: Attribute, index: number) => {
		return (
			<>
				<li
					className={`${styles.AttributesWrapper} ${
						index > 10 && styles.SetOpacityAnimation
					}`}
					key={index}
				>
					<span className={styles.Traits}>{attribute.trait_type}</span>
					<span className={styles.Properties}>{attribute.value} </span>
				</li>
			</>
		);
	};

	const attributesButtonToggler = (numberAttributesHidden: number) => {
		return (
			<>
				<button
					className={`${styles.ToggleAttributes} ${
						isShowMoreAtrributes && styles.SetOpacityAnimation
					}`}
					style={{ background: 'none' }}
					onClick={toggleAttributes}
				>
					{isShowMoreAtrributes
						? 'Show Less'
						: `+${numberAttributesHidden} More`}
				</button>
			</>
		);
	};

	const attributes = () => {
		const getAttributeListLength = setAttributesListLength();

		if (!znsDomain?.attributes) {
			return;
		} else {
			const numberAttributesHidden =
				znsDomain.attributes.length -
				znsDomain.attributes.slice(0, getAttributeListLength).length;

			return (
				<>
					<section
						className={`${styles.Attributes} border-primary border-rounded background-primary`}
					>
						<div className={styles.AttributesContainer}>
							<h4>Attributes</h4>
							<ul className={styles.AttributesGrid}>
								{znsDomain.attributes
									.slice(
										0,
										isShowMoreAtrributes
											? znsDomain.attributes.length
											: getAttributeListLength,
									)
									.map((attribute: Attribute, index: number) =>
										attributesList(attribute, index),
									)}

								{znsDomain?.attributes?.length >= 12 &&
									attributesButtonToggler(numberAttributesHidden)}
							</ul>
						</div>
						<Spring to={{ height: containerHeight }}>
							{(styles) => <animated.div style={styles}></animated.div>}
						</Spring>
					</section>
				</>
			);
		}
	};

	const handleSelectMoreOption = (option: Option) => {
		if (option.title === MORE_ACTION_KEY.MY_DOMAIN_SETTINGS) {
			setIsDomainSettingsOpen(true);
		} else if (option.title === MORE_ACTION_KEY.TRANSFER_OWNERSHIP) {
			onTransfer();
		}
	};

	////////////
	// Render //
	////////////

	return (
		<div className={styles.NFTView}>
			{overlays()}
			<NFT
				domainId={znsDomain?.id}
				account={account as string}
				title={znsDomain?.title as string}
				owner={znsDomain?.owner.id as string}
				creator={znsDomain?.minter.id as string}
				onDownload={downloadAsset}
				onShare={shareAsset}
				assetUrl={
					(znsDomain?.animation_url ||
						znsDomain?.image_full ||
						znsDomain?.image) as string
				}
				description={znsDomain?.description as string}
				buyNowPrice={buyNowPrice}
				highestBid={
					highestBid?.amount
						? Number(ethers.utils.formatEther(highestBid.amount))
						: undefined
				}
				yourBid={yourBid}
				onMakeBid={openBidOverlay}
				wildPriceUsd={wildPriceUsd}
				isPriceDataLoading={isPriceDataLoading}
				onSuccessBuyNow={getPriceData}
				onTransfer={onTransfer}
				isBiddable={isBiddable}
				options={moreOptions}
				onSelectOption={handleSelectMoreOption}
				onRefetch={getPriceData}
			/>

			{nftStats()}

			{attributes()}
			<div className={`${styles.TokenHashContainer}`}>
				<div
					className={`${styles.Box} ${styles.Contract} border-primary border-rounded background-primary`}
				>
					<h4>Token Id</h4>
					<p>
						<img
							onClick={() => copyToClipboard(domainId, 'Token ID')}
							className={styles.Copy}
							src={copyIcon}
							alt={'Copy Contract Icon'}
						/>
						{truncateText(domainId, 18)}
					</p>
					<ArrowLink
						style={{
							marginTop: 8,
							width: 150,
						}}
						href={etherscanLink}
					>
						View on Etherscan
					</ArrowLink>
				</div>
				<div
					className={`${styles.Box} ${styles.Contract} border-primary border-rounded background-primary`}
				>
					<h4>IPFS Hash</h4>
					<p>
						<img
							onClick={() => copyToClipboard(ipfsHash, 'IPFS Hash')}
							className={styles.Copy}
							src={copyIcon}
							alt={'Copy Contract Icon'}
						/>
						{truncateText(ipfsHash, 15)}
					</p>
					<ArrowLink
						style={{
							marginTop: 8,
							width: 105,
						}}
						href={getWebIPFSUrlFromHash(ipfsHash)}
					>
						View on IPFS
					</ArrowLink>
				</div>
			</div>

			{history()}
			{isDomainSettingsOpen && (
				<DomainSettings
					domainId={domainId}
					onClose={() => setIsDomainSettingsOpen(false)}
				/>
			)}
		</div>
	);
};

export default NFTView;
