//- React Imports
import React, { useState, useEffect, useRef } from 'react';

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
} from 'components';
import { BidButton, MakeABid } from 'containers';

//- Library Imports
import { randomName, randomImage } from 'lib/random';
import useNotification from 'lib/hooks/useNotification';
import { useCurrencyProvider } from 'lib/providers/CurrencyProvider';
import { toFiat } from 'lib/currency';

//- Style Imports
import styles from './NFTView.module.scss';

//- Asset Imports
import background from './assets/bg.jpeg';
import copyIcon from './assets/copy-icon.svg';
import { chainIdToNetworkType, getEtherscanUri } from 'lib/network';
import { useZnsContracts } from 'lib/contracts';
import { getDomainId } from 'lib/utils';
import { useZnsDomain } from 'lib/hooks/useZnsDomain';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';
import {
	DomainBidEvent,
	DomainEvent,
	DomainTradingData,
} from '@zero-tech/zns-sdk';
const moment = require('moment');

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
	const { wildPriceUsd } = useCurrencyProvider();

	//- Page State
	const [isOwnedByYou, setIsOwnedByYou] = useState(false); // Is the current domain owned by you?
	const [isBidOverlayOpen, setIsBidOverlayOpen] = useState(false);
	const [allItems, setAllItems] = useState<DomainEvent[] | undefined>();
	const [highestBid, setHighestBid] = useState<DomainBidEvent | undefined>();
	const [highestBidUsd, setHighestBidUsd] = useState<number | undefined>();
	const [backgroundBlob, setBackgroundBlob] = useState<string | undefined>(
		blobCache.current,
	);
	const [tradeData, setTradeData] = useState<DomainTradingData | undefined>();
	const [bids, setBids] = useState<DomainBidEvent[] | undefined>();

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
	const copyContractToClipboard = () => {
		addNotification('Copied Token ID to clipboard.');
		try {
			navigator?.clipboard?.writeText(domainId);
		} catch (e) {
			console.error(e);
		}
	};

	const downloadAsset = () => {
		if (znsDomain?.domain?.image) {
			window.open(znsDomain.domain.image, '_blank');
		}
	};

	const openBidOverlay = () => {
		if (!isMounted.current) return;
		if (!znsDomain.domain || isOwnedByYou || !active) return;
		setIsBidOverlayOpen(true);
	};

	const closeBidOverlay = () => setIsBidOverlayOpen(false);

	const onBid = async () => {
		// @todo switch this to live data
		// should refresh on bid rather than add mock data
		getHistory();
		closeBidOverlay();
	};

	const getHistory = async () => {
		if (znsDomain.domain) {
			const events = await sdk.instance?.getDomainEvents(znsDomain.domain.id);

			const bids = await sdk.getBids(znsDomain.domain.id);
			setBids(bids);
			if (!events || !events.length) {
				setAllItems([]);
				return;
			}

			try {
				const sorted = events.sort(
					(a, b) =>
						new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime(),
				);
				let filter: DomainEvent[] = [];
				//removes repeated timestamps of the sorted array, sdk must fix this later
				sorted.reverse().reduce(function (prev, current) {
					if (prev.timestamp !== current.timestamp) filter.push(current);
					return current;
				});

				const sortedBids = bids?.sort(
					(a, b) => Number(b.amount) - Number(a.amount),
				);

				if (!isMounted.current) return;
				setAllItems(filter);
				setHighestBid(sortedBids?.[0]);
			} catch (e) {
				console.error('Failed to retrieve bid data');
			}
		}
	};
	const getTradeData = async () => {
		if (znsDomain.domain) {
			const data = await sdk.instance.getSubdomainTradingData(
				znsDomain.domain.id,
			);
			console.log(data, znsDomain.domain.id);
			setTradeData(data);
		}
	};

	// useEffect(() => {
	// 	if (!znsDomain.domain) {
	// 		return;
	// 	}
	// 	const getTradeData = async () => {
	// 		const data = await sdk.instance.getSubdomainTradingData(
	// 			znsDomain.domain.id,
	// 		);
	// 		console.log(data, znsDomain.domain.id);
	// 		setTradeData(data);
	// 	};
	// 	getTradeData();
	// }, [znsDomain.domain, sdk.instance]);

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
	}, [highestBid, wildPriceUsd]);

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
		if (
			znsDomain.domain &&
			znsDomain.domain.metadata &&
			!znsDomain.domain.image
		) {
			if (!isMounted.current) return;

			setIsOwnedByYou(
				znsDomain.domain.owner.id.toLowerCase() === account?.toLowerCase(),
			);
			getHistory();
			getTradeData();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [znsDomain.domain]);

	const nftStats = () => {
		const data = [
			{
				fieldName: 'Top Bid',
				title: `${
					tradeData?.highestBid
						? Number(ethers.utils.formatEther(tradeData?.highestBid))
								.toFixed(2)
								.toLocaleString()
						: 0
				} WILD`,
				subTitle: '$1,234.00 USD',
				accentText: '+12% week',
			},
			{
				fieldName: 'Bids',
				title: bids?.length,
				subTitle: '$1,234.00 USD',
				accentText: '+12% week',
			},
			{
				fieldName: 'Last Sale',
				title: `${
					tradeData?.lastSale
						? Number(ethers.utils.formatEther(tradeData?.lastSale))
								.toFixed(2)
								.toLocaleString()
						: 0
				} WILD`,
				subTitle: '$1,234.00 USD',
				accentText: '+12% week',
			},
			{
				fieldName: 'Volume',
				title: tradeData?.volume,
				subTitle: '$1,234.00 USD',
				accentText: '+12% week',
			},
		];

		return (
			<>
				<div className={styles.Stats}>
					{data.map((item) => (
						<StatsWidget {...item}></StatsWidget>
					))}
				</div>
			</>
		);
	};

	const overlays = () => (
		<>
			{znsDomain.domain && (
				<Overlay onClose={closeBidOverlay} open={isBidOverlayOpen}>
					<MakeABid domain={znsDomain.domain} onBid={onBid} />
				</Overlay>
			)}
		</>
	);

	const price = () => (
		<>
			{highestBid && (
				<div className={styles.Price}>
					<h2>Highest Bid</h2>
					<span className={styles.Crypto}>
						{Number(ethers.utils.formatEther(highestBid.amount))
							.toFixed(2)
							.toLocaleString()}{' '}
						WILD{' '}
						{highestBidUsd !== undefined && wildPriceUsd > 0 && (
							<span className={styles.Fiat}>(${toFiat(highestBidUsd)})</span>
						)}
					</span>
				</div>
			)}
		</>
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
								href={`https://etherscan.io/address/${item.bidder!}`}
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
								href={`https://etherscan.io/address/${item.bidder!}`}
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

	const actionButtons = () => (
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
	);

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
					/>
				</div>
				<div className={styles.Info}>
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
						{price()}
						{actionButtons()}
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

			<div
				className={`${styles.Box} ${styles.Contract} blur border-primary border-rounded`}
			>
				<h4>Token Id</h4>
				<p>
					<img
						onClick={copyContractToClipboard}
						className={styles.Copy}
						src={copyIcon}
						alt={'Copy Contract Icon'}
					/>
					{domainId}
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
			{history()}
		</div>
	);
};

export default NFTView;
