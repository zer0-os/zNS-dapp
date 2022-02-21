//- React Imports
import React, { useState, useEffect, useRef } from 'react';
import { Spring, animated } from 'react-spring';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core'; // Wallet data
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'; // Wallet data
import { BigNumber, ethers } from 'ethers';

//- Component Imports
import { ArrowLink, Overlay, StatsWidget } from 'components';
import { MakeABid, SetBuyNow, BuyNow } from 'containers';

//- Library Imports
import useNotification from 'lib/hooks/useNotification';
import useCurrency from 'lib/hooks/useCurrency';
import { toFiat } from 'lib/currency';
import { chainIdToNetworkType, getEtherscanUri } from 'lib/network';
import { useZnsContracts } from 'lib/contracts';
import { Attribute } from 'lib/types';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';
import {
	DomainBidEvent,
	DomainEvent,
	DomainMetrics,
} from '@zero-tech/zns-sdk/lib/types';

//- Style Imports
import styles from './NFTView.module.scss';

//- Asset Imports
import background from './assets/bg.jpeg';
import copyIcon from './assets/copy-icon.svg';
import useMatchMedia from 'lib/hooks/useMatchMedia';
import { getHashFromIPFSUrl, getWebIPFSUrlFromHash } from 'lib/ipfs';
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';
import NFT from './components/NFT';
import { Bid } from '@zero-tech/zauction-sdk';
const moment = require('moment');

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
	const blobCache = useRef<string>();
	const { addNotification } = useNotification();
	const { wildPriceUsd } = useCurrency();

	const isMobile = useMatchMedia('phone');
	const isTabletPortrait = useMatchMedia('(max-width: 768px)');
	const isMobilePortrait = useMatchMedia('(max-width: 428px)');

	//- Page State
	const [isPriceDataLoading, setIsPriceDataLoading] = useState<boolean>();
	const [isBidOverlayOpen, setIsBidOverlayOpen] = useState(false);
	const [isBuyNowOverlayOpen, setIsBuyNowOverlayOpen] =
		useState<boolean>(false);
	const [allItems, setAllItems] = useState<DomainEvent[] | undefined>();
	const [highestBid, setHighestBid] = useState<Bid | undefined>();
	const [backgroundBlob, setBackgroundBlob] = useState<string | undefined>(
		blobCache.current,
	);
	const [buyNowPrice, setBuyNowPrice] = useState<number | undefined>();
	const [yourBid, setYourBid] = useState<number | undefined>();
	const [tradeData, setTradeData] = useState<DomainMetrics | undefined>();
	const [bids, setBids] = useState<DomainBidEvent[] | undefined>();
	const [statsLoaded, setStatsLoaded] = useState(false);
	const [isShowMoreAtrributes, setIsShowMoreAttributes] =
		useState<boolean>(false);
	const [containerHeight, setContainerHeight] = useState(0);
	const [ipfsHash, setIpfsHash] = useState<string>('');

	const { domainId, domain: znsDomain, domainRaw: domain } = useCurrentDomain();

	//- Web3 Domain Data
	// const domainId = getDomainId(domain.substring(1));
	const domainIdInteger = BigNumber.from(domainId); //domainId as bignumber used to redirect to etherscan link

	// const znsDomain = useZnsDomain(domainId);

	//- Web3 Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { account, active, chainId, library } = walletContext;

	const networkType = chainIdToNetworkType(chainId);
	const contracts = useZnsContracts();
	const registrarAddress = contracts ? contracts.registry.address : '';

	const etherscanBaseUri = getEtherscanUri(networkType);
	const etherscanLink = `${etherscanBaseUri}token/${registrarAddress}?a=${domainIdInteger.toString()}`;

	const isOwnedByYou =
		znsDomain?.owner.id.toLowerCase() === account?.toLowerCase();

	const sdk = useZnsSdk();
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

	const openBuyNowOverlay = () => {
		setIsBuyNowOverlayOpen(true);
	};

	const closeBuyNowOverlay = () => {
		setIsBuyNowOverlayOpen(false);
	};

	const onBid = async () => {
		// @todo switch this to live data
		// should refresh on bid rather than add mock data
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
		if (!znsDomain?.id || !library) {
			return;
		}
		const { id } = znsDomain;
		setIsPriceDataLoading(true);
		const zAuction = await sdk.instance.getZAuctionInstanceForDomain(id);

		// // Get buy now and all bids
		const [listing, bids] = await Promise.all([
			zAuction.getBuyNowPrice(id, library.getSigner()),
			zAuction.listBids([id]),
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
			if (yourBid?.amount) {
				setYourBid(Number(ethers.utils.formatEther(yourBid.amount)));
			}
		}

		setHighestBid(highestBid);
		setBuyNowPrice(Number(ethers.utils.formatEther(buyNow)));
		setIsPriceDataLoading(false);
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

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		isMounted.current = true;

		fetch(background)
			.then((r) => r.blob())
			.then((blob) => {
				const url = URL.createObjectURL(blob);
				blobCache.current = url;
				setBackgroundBlob(url);
			});
		return () => {
			isMounted.current = false;
		};
	}, []);

	useEffect(() => {
		if (!isMounted.current) return;
		if (znsDomain) {
			if (!isMounted.current) return;

			getPriceData();
			getHistory();
			setStatsLoaded(false);
			getTradeData();
			setIpfsHash(getHashFromIPFSUrl(znsDomain.metadata));
		}

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
					{data.map((item, index) => (
						<>
							{!item.isHidden ? (
								<StatsWidget
									key={`stats-widget-${index}`}
									title={item.title}
									fieldName={item.fieldName}
									subTitle={item.subTitle}
									isLoading={!statsLoaded || !allItems}
									className="previewView"
									style={{
										width: width,
									}}
								></StatsWidget>
							) : null}
						</>
					))}
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
				className={`${styles.History} ${styles.Box} blur border-primary border-rounded`}
			>
				<h4>History</h4>
				{!allItems && (
					<div className={styles.Loading}>
						<span>Loading domain history</span>
					</div>
				)}
				{allHistoryItems && allHistoryItems.length > 0 && (
					<ul>
						{allHistoryItems.map((item: DomainEvent, i: number) =>
							historyItem(item, i),
						)}
					</ul>
				)}
			</section>
		);
	};

	const historyItem = (item: DomainEvents, i: number) => {
		if (item.type === 2) {
			return (
				<li className={styles.Bid} key={i}>
					<div>
						<b>
							<a
								className="alt-link"
								href={`https://etherscan.io/address/${item.bidder!}`}
								target="_blank"
								rel="noreferrer"
							>{`${item.bidder!.substring(0, 4)}...${item.bidder!.substring(
								item.bidder!.length - 4,
							)}`}</a>
						</b>{' '}
						made an offer of{' '}
						<b>
							{Number(ethers.utils.formatEther(item.amount!)).toLocaleString()}{' '}
							WILD
						</b>
					</div>
					<div className={styles.From}>
						<b>{moment(Number(item!.timestamp)).fromNow()}</b>
					</div>
				</li>
			);
		} else if (item.type === 0) {
			return (
				<li className={styles.Bid} key={i}>
					<div>
						<b>
							<a
								className="alt-link"
								href={`https://etherscan.io/address/${item.minter!}`}
								target="_blank"
								rel="noreferrer"
							>{`${item.minter!.substring(0, 4)}...${item.minter!.substring(
								item.minter!.length - 4,
							)}`}</a>
						</b>{' '}
						minted the domain
					</div>
					<div className={styles.From}>
						<b>{moment(Number(item.timestamp!) * 1000).fromNow()}</b>
					</div>
				</li>
			);
		} else if (item.type === 1) {
			return (
				<li className={styles.Bid} key={i}>
					<div>
						<b>
							<a
								className="alt-link"
								href={`https://etherscan.io/address/${item.from!}`}
								target="_blank"
								rel="noreferrer"
							>{`${item.from!.substring(0, 4)}...${item.from!.substring(
								item.from!.length - 4,
							)}`}</a>
						</b>{' '}
						transferred ownership to{' '}
						<b>
							<a
								className="alt-link"
								href={`https://etherscan.io/address/${item.to!}`}
								target="_blank"
								rel="noreferrer"
							>{`${item.to!.substring(0, 4)}...${item.to!.substring(
								item.to!.length - 4,
							)}`}</a>
						</b>{' '}
					</div>
					<div className={styles.From}>
						<b>{moment(Number(item.timestamp) * 1000).fromNow()}</b>
					</div>
				</li>
			);
		} else if (item.type === 3) {
			return (
				<li className={styles.Bid} key={i}>
					<div>
						<b>
							3
							<a
								className="alt-link"
								href={`https://etherscan.io/address/${item.seller!}`}
								target="_blank"
								rel="noreferrer"
							>{`${item.seller!.substring(0, 4)}...${item.seller!.substring(
								item.seller!.length - 4,
							)}`}</a>
						</b>{' '}
						sold this NFT to{' '}
						<b>
							<a
								className="alt-link"
								href={`https://etherscan.io/address/${item.buyer!}`}
								target="_blank"
								rel="noreferrer"
							>{`${item.buyer!.substring(0, 4)}...${item.buyer!.substring(
								item.buyer!.length - 4,
							)}`}</a>
						</b>{' '}
						{item.amount && (
							<>
								for{' '}
								<b>
									{Number(
										ethers.utils.formatEther(item.amount!),
									).toLocaleString()}{' '}
									WILD
								</b>
							</>
						)}
					</div>
					<div className={styles.From}>
						<b>{moment(Number(item.timestamp) * 1000).fromNow()}</b>
					</div>
				</li>
			);
		}
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
						className={`${styles.Attributes}  blur border-primary border-rounded`}
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
				onBuyNow={openBuyNowOverlay}
				wildPriceUsd={wildPriceUsd}
				isPriceDataLoading={isPriceDataLoading}
			/>

			{nftStats()}

			{attributes()}
			<div className={`${styles.TokenHashContainer}`}>
				<div
					className={`${styles.Box} ${styles.Contract} blur border-primary border-rounded`}
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
					className={`${styles.Box} ${styles.Contract} blur border-primary border-rounded`}
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
		</div>
	);
};

export default NFTView;
