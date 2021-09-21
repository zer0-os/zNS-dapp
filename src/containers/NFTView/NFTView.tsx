//- React Imports
import React, { useState, useEffect, useRef } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core'; // Wallet data
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'; // Wallet data
import { useHistory } from 'react-router';
import { BigNumber } from 'ethers';

//- Component Imports
import {
	ArrowLink,
	FutureButton,
	Member,
	Image,
	NFTMedia,
	Overlay,
	Spinner,
} from 'components';
import { MakeABid } from 'containers';

//- Library Imports
import { randomName, randomImage } from 'lib/Random';
import useNotification from 'lib/hooks/useNotification';
import { useBidProvider } from 'lib/providers/BidProvider';
import { useCurrencyProvider } from 'lib/providers/CurrencyProvider';
import { toFiat } from 'lib/currency';

//- Style Imports
import styles from './NFTView.module.css';

//- Asset Imports
import galaxyBackground from './assets/galaxy.png';
import copyIcon from './assets/copy-icon.svg';
import { Bid } from 'lib/types';
import { chainIdToNetworkType, getEtherscanUri } from 'lib/network';
import { useZnsContracts } from 'lib/contracts';
import { getDomainId } from 'lib/utils';
import { useZnsDomain } from 'lib/hooks/useZnsDomain';
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';
const moment = require('moment');

type NFTViewProps = {
	domain: string;
	onTransfer: () => void;
};

const NFTView: React.FC<NFTViewProps> = ({ domain, onTransfer }) => {
	// TODO: NFT page data shouldn't change before unloading - maybe deep copy the data first

	//- Notes:
	// It's worth having this component consume the domain context
	// because it needs way more data than is worth sending through props

	const isMounted = useRef(false);
	const blobCache = useRef<string>();
	const { addNotification } = useNotification();
	const { wildPriceUsd } = useCurrencyProvider();

	//- Page State
	const [isOwnedByYou, setIsOwnedByYou] = useState(false); // Is the current domain owned by you?
	const [isImageOverlayOpen, setIsImageOverlayOpen] = useState(false);
	const [isBidOverlayOpen, setIsBidOverlayOpen] = useState(false);
	const [bids, setBids] = useState<Bid[] | undefined>();
	const [highestBid, setHighestBid] = useState<Bid | undefined>();
	const [highestBidUsd, setHighestBidUsd] = useState<number | undefined>();
	const [backgroundBlob, setBackgroundBlob] = useState<string | undefined>(
		blobCache.current,
	);

	//- Web3 Domain Data
	const domainId = getDomainId(domain.substring(1));
	const domainIdInteger = BigNumber.from(domainId); //domainId as bignumber used to redirect to etherscan link

	const { domain: znsDomain, loading, refetch } = useCurrentDomain();

	const { getBidsForDomain } = useBidProvider();

	//- Web3 Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { account, active, chainId } = walletContext;

	const networkType = chainIdToNetworkType(chainId);
	const contracts = useZnsContracts();
	const registrarAddress = contracts ? contracts.registry.address : '';

	const etherscanBaseUri = getEtherscanUri(networkType);
	const etherscanLink = `${etherscanBaseUri}token/${registrarAddress}?a=${domainIdInteger.toString()}`;

	//- Functions
	const copyContractToClipboard = () => {
		addNotification('Copied Token ID to clipboard.');
		try {
			navigator?.clipboard?.writeText(domainId);
		} catch (e) {
			console.error(e);
		}
	};

	const openBidOverlay = () => {
		if (!isMounted.current) return;
		if (!znsDomain || isOwnedByYou || !active) return;
		setIsBidOverlayOpen(true);
	};

	const closeBidOverlay = () => setIsBidOverlayOpen(false);

	const onBid = async () => {
		// @todo switch this to live data
		// should refresh on bid rather than add mock data
		getBids();
		closeBidOverlay();
	};

	const getBids = async () => {
		if (znsDomain) {
			const bids = await getBidsForDomain(znsDomain);

			if (!bids || !bids.length) {
				setBids([]);
				return;
			}
			try {
				const sorted = bids.sort((a, b) => b.date.getTime() - a.date.getTime());
				const highestBid = bids.reduce(function (prev, current) {
					return prev.amount > current.amount ? prev : current;
				});
				if (!isMounted.current) return;
				setBids(sorted);
				setHighestBid(highestBid);
			} catch (e) {
				console.error('Failed to retrieve bid data');
			}
		}
	};

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		if (!highestBid) {
			return;
		}
		setHighestBidUsd(highestBid.amount * wildPriceUsd);
	}, [highestBid, wildPriceUsd]);

	useEffect(() => {
		isMounted.current = true;

		fetch(galaxyBackground)
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
		if (znsDomain && znsDomain.metadata && !znsDomain.image) {
			if (!isMounted.current) return;
			setIsOwnedByYou(
				znsDomain.owner.id.toLowerCase() === account?.toLowerCase(),
			);

			getBids();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [znsDomain]);

	const overlays = () => (
		<>
			{znsDomain && (
				<Overlay onClose={closeBidOverlay} open={isBidOverlayOpen}>
					<MakeABid domain={znsDomain} onBid={onBid} />
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
						{Number(highestBid.amount.toFixed(2)).toLocaleString()} WILD{' '}
						{highestBidUsd !== undefined && wildPriceUsd > 0 && (
							<span className={styles.Fiat}>(${toFiat(highestBidUsd)})</span>
						)}
					</span>
				</div>
			)}
		</>
	);

	const history = () => (
		<section
			className={`${styles.History} ${styles.Box} blur border-primary border-rounded`}
		>
			<h4>History</h4>
			{!bids && (
				<div className={styles.Loading}>
					<span>Loading bid history</span>
				</div>
			)}
			{bids && bids.length === 0 && (
				<span style={{ marginTop: 12, display: 'block' }}>No bids</span>
			)}
			{bids && bids.length > 0 && (
				<ul>
					{bids?.map((bid: Bid, i: number) =>
						historyItem(bid.bidderAccount, bid.amount, bid.date, i),
					)}
				</ul>
			)}
		</section>
	);

	const historyItem = (
		account: string,
		amount: number,
		date: Date,
		i: number,
	) => (
		<li className={styles.Bid} key={i}>
			<div>
				<b>
					<a
						className="alt-link"
						href={`https://etherscan.io/address/${account}`}
						target="_blank"
						rel="noreferrer"
					>{`${account.substring(0, 4)}...${account.substring(
						account.length - 4,
					)}`}</a>
				</b>{' '}
				made an offer of <b>{Number(amount).toLocaleString()} WILD</b>
			</div>
			<div className={styles.From}>
				<b>{moment(date).fromNow()}</b>
			</div>
		</li>
	);

	const actionButtons = () => (
		<div className={styles.Buttons}>
			<FutureButton
				glow={isOwnedByYou}
				onClick={() => isOwnedByYou && onTransfer()}
				style={{ height: 36, borderRadius: 18 }}
			>
				Transfer Ownership
			</FutureButton>
			<FutureButton
				glow={!isOwnedByYou && active}
				onClick={openBidOverlay}
				style={{ height: 36, borderRadius: 18 }}
			>
				Make A Bid
			</FutureButton>
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
				} border-primary border-rounded`}
			>
				<div className={`${styles.Image} border-rounded`}>
					<NFTMedia
						style={{
							borderRadius: 10,
							borderWidth: 2,
							objectFit: 'contain',
						}}
						className={`border-rounded`}
						alt="NFT Preview"
						ipfsUrl={znsDomain?.image ?? ''}
					/>
				</div>
				<div className={styles.Info}>
					<div className={styles.Details}>
						<div>
							<h1 className="glow-text-white">{znsDomain?.title ?? ''}</h1>
							<span>
								{domain.length > 0 ? `0://wilder.${domain.substring(1)}` : ''}
							</span>
						</div>
						<div className={styles.Members}>
							<Member
								id={znsDomain?.owner?.id || ''}
								name={znsDomain ? randomName(znsDomain.owner.id) : ''}
								image={znsDomain ? randomImage(znsDomain.owner.id) : ''}
								subtext={'Owner'}
							/>
							<Member
								id={znsDomain ? znsDomain.minter?.id : ''}
								name={znsDomain ? randomName(znsDomain.minter.id) : ''}
								image={znsDomain ? randomImage(znsDomain.minter.id) : ''}
								subtext={'Creator'}
							/>
						</div>
					</div>
					{price()}
					{actionButtons()}
					{backgroundBlob !== undefined && (
						<img src={backgroundBlob} className={styles.Bg} />
					)}
				</div>
			</div>
			<div className={styles.Horizontal} style={{ marginTop: 20 }}>
				<div
					className={`${styles.Box} ${styles.Story} blur border-primary border-rounded`}
				>
					<h4>Story</h4>
					{/* <p>{znsDomain.domain?.description ?? ''}</p> */}
				</div>
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
			</div>
			{history()}
		</div>
	);
};

export default NFTView;
