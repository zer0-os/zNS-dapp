//- React Imports
import React, { useState, useEffect, useRef } from 'react';
import { Spring, animated } from 'react-spring';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core'; // Wallet data
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'; // Wallet data
import { BigNumber, ethers } from 'ethers';

//- Component Imports
import {
	ArrowLink,
	FutureButton,
	Member,
	NFTMedia,
	Overlay,
	StatsWidget,
	Tooltip,
} from 'components';
import { BidButton, BuyNowButton, MakeABid, MakeABuy } from 'containers';

//- Library Imports
import { randomName, randomImage } from 'lib/random';
import useNotification from 'lib/hooks/useNotification';
import useCurrency from 'lib/hooks/useCurrency';
import { toFiat } from 'lib/currency';
import { chainIdToNetworkType, getEtherscanUri } from 'lib/network';
import { useZnsContracts } from 'lib/contracts';
import { getDomainId } from 'lib/utils';
import { useZnsDomain } from 'lib/hooks/useZnsDomain';
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
import downloadIcon from './assets/download.svg';
import shareIcon from './assets/share.svg';
import useMatchMedia from 'lib/hooks/useMatchMedia';
import { getHashFromIPFSUrl, getWebIPFSUrlFromHash } from 'lib/ipfs';
const moment = require('moment');

const ZNS_SHARE_BASE_URL = process.env.REACT_APP_ZNS_SHARE_BASE_URL as string;

type NFTViewProps = {
	domain: string;
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

const NFTView: React.FC<NFTViewProps> = ({ domain, onTransfer }) => {
	const isMounted = useRef(false);
	const blobCache = useRef<string>();
	const { addNotification } = useNotification();
	const { wildPriceUsd } = useCurrency();

	const isMobile = useMatchMedia('phone');
	const isTabletPortrait = useMatchMedia('(max-width: 768px)');
	const isMobilePortrait = useMatchMedia('(max-width: 428px)');

	//- Page State
	const [isOwnedByYou, setIsOwnedByYou] = useState(false); // Is the current domain owned by you?
	const [isBidOverlayOpen, setIsBidOverlayOpen] = useState(false);
	const [allItems, setAllItems] = useState<DomainEvent[] | undefined>();
	const [highestBid, setHighestBid] = useState<DomainBidEvent | undefined>();
	const [highestBidUsd, setHighestBidUsd] = useState<number | undefined>();
	const [backgroundBlob, setBackgroundBlob] = useState<string | undefined>(
		blobCache.current,
	);
	const [tradeData, setTradeData] = useState<DomainMetrics | undefined>();
	const [bids, setBids] = useState<DomainBidEvent[] | undefined>();
	const [statsLoaded, setStatsLoaded] = useState(false);
	const [isShowMoreAtrributes, setIsShowMoreAttributes] =
		useState<boolean>(false);
	const [containerHeight, setContainerHeight] = useState(0);
	const [ipfsHash, setIpfsHash] = useState<string>('');
	const [buyNowPrice, setBuyNowPrice] = useState<string | undefined>(
		'1000000000000000000000',
	);
	const [buyNowPriceUsd, setBuyNowPriceUsd] = useState<number | undefined>();
	const [isBuyOverlayOpen, setIsBuyOverlayOpen] = useState(false);

	//- Web3 Domain Data
	const domainId = getDomainId(domain.substring(1));
	const domainIdInteger = BigNumber.from(domainId); //domainId as bignumber used to redirect to etherscan link

	const znsDomain = useZnsDomain(domainId);

	//- Web3 Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { account, active, chainId } = walletContext;

	const networkType = chainIdToNetworkType(chainId);
	const contracts = useZnsContracts();
	const registrarAddress = contracts ? contracts.registry.address : '';

	const etherscanBaseUri = getEtherscanUri(networkType);
	const etherscanLink = `${etherscanBaseUri}token/${registrarAddress}?a=${domainIdInteger.toString()}`;

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
		if (znsDomain?.domain?.image_full || znsDomain?.domain?.image) {
			// Get hash from asset

			const url = (znsDomain.domain.image_full || znsDomain.domain.image)!;
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
						`https://res.cloudinary.com/fact0ry/video/upload/c_fit,h_900,w_900,fps_1-24,f_mp4,vc_h264/v1631501273/zns/${hash}.mp4`,
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
		const url = `${ZNS_SHARE_BASE_URL}${domain}`;
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
		if (!znsDomain.domain || isOwnedByYou || !active) return;
		setIsBidOverlayOpen(true);
	};

	const openBuyOverlay = () => {
		if (!isMounted.current) return;
		if (!znsDomain.domain || isOwnedByYou || !active) return;
		setIsBuyOverlayOpen(true);
	};

	const closeBidOverlay = () => setIsBidOverlayOpen(false);

	const closeBuyOverlay = () => setIsBuyOverlayOpen(false);

	const onBid = async () => {
		// @todo switch this to live data
		// should refresh on bid rather than add mock data
		getHistory();
		closeBidOverlay();
	};

	const getHistory = async () => {
		if (znsDomain.domain) {
			try {
				const events = await sdk.instance?.getDomainEvents(znsDomain.domain.id);

				const bids = events.filter((e) => e.type === 2) as DomainBidEvent[];
				setBids(bids);
				const highest = bids.sort((a, b) => {
					return (
						Number(ethers.utils.formatEther(b.amount)) -
						Number(ethers.utils.formatEther(a.amount))
					);
				})[0];

				if (!isMounted.current) return;
				setAllItems(events);
				setHighestBid(highest);
			} catch (e) {
				console.error('Failed to retrieve bid data');
			}
		}
	};
	const getTradeData = async () => {
		if (znsDomain.domain) {
			const data = await sdk.instance.getDomainMetrics([znsDomain.domain.id]);
			setTradeData(data[znsDomain.domain.id]);
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
		if (!highestBid) {
			return;
		}
		setHighestBidUsd(
			Number(ethers.utils.formatEther(highestBid.amount)) * wildPriceUsd,
		);

		if (buyNowPrice) {
			setBuyNowPriceUsd(
				Number(ethers.utils.formatEther(buyNowPrice)) * wildPriceUsd,
			);
		}
	}, [highestBid, wildPriceUsd, buyNowPrice]);

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
		if (znsDomain.domain) {
			if (!isMounted.current) return;

			setIsOwnedByYou(
				znsDomain.domain.owner.id.toLowerCase() === account?.toLowerCase(),
			);
			getHistory();
			setStatsLoaded(false);
			getTradeData();
			setIpfsHash(getHashFromIPFSUrl(znsDomain.domain.metadata));
		}

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [znsDomain.domain]);

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
					{data.map((item) => (
						<>
							{!item.isHidden ? (
								<StatsWidget
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

	const overlays = () => (
		<>
			{znsDomain.domain &&
				(isBidOverlayOpen ? (
					<Overlay onClose={closeBidOverlay} open={isBidOverlayOpen}>
						<MakeABid domain={znsDomain.domain} onBid={onBid} />
					</Overlay>
				) : (
					<Overlay onClose={closeBuyOverlay} open={isBuyOverlayOpen}>
						<MakeABuy domain={znsDomain.domain} />
					</Overlay>
				))}
		</>
	);

	const actionBuy = () => (
		<div>
			{buyNowPrice && (
				<div className={styles.Price}>
					<h2>Buy Now (WILD)</h2>
					<div className={styles.Crypto}>
						{Intl.NumberFormat('en-US', {
							minimumFractionDigits: 2,
						}).format(Number(ethers.utils.formatEther(buyNowPrice)))}{' '}
					</div>
					{buyNowPriceUsd !== undefined && wildPriceUsd > 0 && (
						<div className={styles.Fiat}>${toFiat(buyNowPriceUsd)}</div>
					)}
				</div>
			)}
			<div className={styles.Buttons}>
				{isOwnedByYou && (
					<FutureButton
						glow={isOwnedByYou}
						onClick={() => isOwnedByYou && onTransfer()}
						style={{ height: 36, borderRadius: 18 }}
					>
						Transfer Ownership
					</FutureButton>
				)}
				{!isOwnedByYou && (
					<BuyNowButton
						glow={!isOwnedByYou && active}
						onClick={openBuyOverlay}
						style={{ height: 36, borderRadius: 18 }}
					>
						Buy Now
					</BuyNowButton>
				)}
			</div>
		</div>
	);

	const actionBid = () => (
		<div>
			{highestBid && (
				<div className={styles.Price}>
					<h2>Highest Bid (WILD)</h2>
					<div className={styles.Crypto}>
						{Intl.NumberFormat('en-US', {
							minimumFractionDigits: 2,
						}).format(
							Number(ethers.utils.formatEther(highestBid.amount!)),
						)}{' '}
					</div>
					{highestBidUsd !== undefined && wildPriceUsd > 0 && (
						<div className={styles.Fiat}>${toFiat(highestBidUsd)}</div>
					)}
				</div>
			)}
			<div className={styles.Buttons}>
				{isOwnedByYou && (
					<FutureButton
						glow={isOwnedByYou}
						onClick={() => isOwnedByYou && onTransfer()}
						style={{ height: 36, borderRadius: 18 }}
					>
						Transfer Ownership
					</FutureButton>
				)}
				{!isOwnedByYou && (
					<BidButton
						glow={!isOwnedByYou && active}
						onClick={openBidOverlay}
						style={{ height: 36, borderRadius: 18 }}
					>
						Make A Bid
					</BidButton>
				)}
			</div>
		</div>
	);

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
								href={`https://etherscan.io/address/${item.bidder!}`}
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
								href={`https://etherscan.io/address/${item!.bidder}`}
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
								href={`https://etherscan.io/address/${item!.bidder}`}
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

		if (!znsDomain.domain?.attributes) {
			return;
		} else {
			const numberAttributesHidden =
				znsDomain.domain.attributes.length -
				znsDomain.domain.attributes.slice(0, getAttributeListLength).length;

			return (
				<>
					<section
						className={`${styles.Attributes}  blur border-primary border-rounded`}
					>
						<div className={styles.AttributesContainer}>
							<h4>Attributes</h4>
							<ul className={styles.AttributesGrid}>
								{znsDomain.domain.attributes
									.slice(
										0,
										isShowMoreAtrributes
											? znsDomain.domain.attributes.length
											: getAttributeListLength,
									)
									.map((attribute: Attribute, index: number) =>
										attributesList(attribute, index),
									)}

								{znsDomain.domain?.attributes?.length >= 12 &&
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
			<div
				className={`${styles.NFT} ${
					backgroundBlob !== undefined ? styles.Loaded : ''
				} border-primary`}
			>
				<div className={`${styles.Image}`}>
					<NFTMedia
						style={{
							objectFit: 'contain',
						}}
						alt="NFT Preview"
						ipfsUrl={
							znsDomain.domain?.image_full || znsDomain.domain?.image || ''
						}
						size="large"
					/>
				</div>
				<div className={styles.Info}>
					<div className={styles.Tray}>
						{/* share icon hidden until share functionality is done */}
						{/* <button>
							<img src={shareIcon} />
						</button> */}
						<Tooltip text={'Share to Twitter'}>
							<button onClick={shareAsset}>
								<img src={shareIcon} alt="share asset" />
							</button>
						</Tooltip>
						<Tooltip text={'Download for Twitter'}>
							<button onClick={downloadAsset}>
								<img alt="download asset" src={downloadIcon} />
							</button>
						</Tooltip>
					</div>
					<div className={styles.Details}>
						<div>
							<h1 className="glow-text-white">
								{znsDomain.domain?.title ?? ''}
							</h1>
						</div>
						<div className={styles.Members}>
							<Member
								id={znsDomain.domain ? znsDomain.domain.owner.id : ''}
								name={
									znsDomain.domain ? randomName(znsDomain.domain.owner.id) : ''
								}
								image={
									znsDomain.domain ? randomImage(znsDomain.domain.owner.id) : ''
								}
								subtext={'Owner'}
							/>
							<Member
								id={znsDomain.domain ? znsDomain.domain.minter.id : ''}
								name={
									znsDomain.domain ? randomName(znsDomain.domain.minter.id) : ''
								}
								image={
									znsDomain.domain
										? randomImage(znsDomain.domain.minter.id)
										: ''
								}
								subtext={'Creator'}
							/>
						</div>
						<div className={styles.Story}>
							{znsDomain.domain?.description ?? ''}
						</div>
						{highestBid && console.log(highestBid!.amount!)}
						<div className={styles.Action}>
							{buyNowPrice !== undefined ? actionBuy() : actionBid()}
							{buyNowPrice !== undefined && highestBid ? (
								<>
									<div className={styles.Divider} />
									{actionBid()}
								</>
							) : (
								''
							)}
						</div>
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
