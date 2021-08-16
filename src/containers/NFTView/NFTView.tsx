//- React Imports
import React, { useState, useEffect, useRef } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core'; // Wallet data
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'; // Wallet data
import { useHistory } from 'react-router';

//- Component Imports
import {
	ArrowLink,
	FutureButton,
	Member,
	Image,
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
	const { addNotification } = useNotification();
	const { wildPriceUsd } = useCurrencyProvider();

	//- Page State
	const [isOwnedByYou, setIsOwnedByYou] = useState(false); // Is the current domain owned by you?
	const [isImageOverlayOpen, setIsImageOverlayOpen] = useState(false);
	const [isBidOverlayOpen, setIsBidOverlayOpen] = useState(false);
	const [bids, setBids] = useState<Bid[] | undefined>();
	const [highestBid, setHighestBid] = useState<Bid | undefined>();
	const [highestBidUsd, setHighestBidUsd] = useState<number | undefined>();

	//- Web3 Domain Data
	const domainId = getDomainId(domain.substring(1));
	const domainIdInteger = parseInt(domainId,16)
	

	const znsDomain = useZnsDomain(domainId);

	const { getBidsForDomain } = useBidProvider();

	//- Web3 Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { account, chainId } = walletContext;

	const networkType = chainIdToNetworkType(chainId);
	const contracts = useZnsContracts();
	const registrarAddress = contracts ? contracts.registry.address : '';

	const etherscanBaseUri = getEtherscanUri(networkType);
	const etherscanLink = `${etherscanBaseUri}token/${registrarAddress}?a=${domainIdInteger.toString(16)}`;

	//- Functions
	const copyContractToClipboard = () => {
		addNotification('Copied Token ID to clipboard.');
		navigator.clipboard.writeText(domainId);
	};

	const openBidOverlay = () => {
		if (!isMounted.current) return;
		if (!znsDomain.domain || isOwnedByYou) return;
		setIsBidOverlayOpen(true);
	};

	const openImageOverlay = () => {
		if (!isMounted.current) return;
		setIsImageOverlayOpen(true);
	};

	const closeImageOverlay = () => {
		if (!isMounted.current) return;
		setIsImageOverlayOpen(false);
	};

	const closeBidOverlay = () => setIsBidOverlayOpen(false);

	const onBid = async () => {
		// @todo switch this to live data
		// should refresh on bid rather than add mock data
		getBids();
		closeBidOverlay();
	};

	const getBids = async () => {
		if (znsDomain.domain) {
			const bids = await getBidsForDomain(znsDomain.domain);

			if (!bids || !bids.length) {
				setBids([]);
				return;
			}
			try {
				const sorted = bids.sort((a, b) => b.date.getTime() - a.date.getTime());
				if (!isMounted.current) return;
				setBids(sorted);
				setHighestBid(sorted[0]);
				setHighestBidUsd(sorted[0].amount * wildPriceUsd);
			} catch (e) {
				console.error('Failed to retrieve bid data');
			}
		}
	};

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		isMounted.current = true;
		return () => {
			isMounted.current = false;
		};
	});

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

			getBids();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [znsDomain.domain]);

	const overlays = () => (
		<>
			<Overlay
				centered
				img
				open={isImageOverlayOpen}
				onClose={closeImageOverlay}
			>
				<Image
					src={znsDomain.domain?.image ?? ''}
					style={{
						width: 'auto',
						maxHeight: '80vh',
						maxWidth: '80vw',
						objectFit: 'contain',
						textAlign: 'center',
					}}
				/>
			</Overlay>

			{znsDomain.domain && (
				<Overlay onClose={closeBidOverlay} centered open={isBidOverlayOpen}>
					<MakeABid domain={znsDomain.domain} onBid={onBid} />
				</Overlay>
			)}
		</>
	);

	const price = () => (
		<>
			{highestBid && (
				<div className={styles.Price}>
					<h2 className="glow-text-blue">Highest Bid</h2>
					<span className={styles.Crypto}>
						{Number(highestBid.amount.toFixed(2)).toLocaleString()} WILD{' '}
						{highestBidUsd && (
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
					<Spinner />
					<span>Loading bid history</span>
				</div>
			)}
			{bids && bids.length === 0 && (
				<span style={{ marginTop: 23, display: 'block' }}>No bids</span>
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
				made an offer of{' '}
				<b>{Number(amount.toFixed(2)).toLocaleString()} WILD</b>
			</div>
			<div>
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
				glow={!isOwnedByYou}
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
				className={`${styles.NFT} blur border-primary border-rounded`}
				style={{ backgroundImage: `url(${galaxyBackground})` }}
			>
				<div className={`${styles.Image} border-rounded`}>
					<Image
						style={{
							height: 422,
							borderRadius: 10,
							borderWidth: 2,
						}}
						className="border-primary border-radius"
						src={znsDomain.domain?.image ?? ''}
						onClick={openImageOverlay}
					/>
				</div>
				<div className={styles.Info}>
					<div>
						<h1 className="glow-text-white">{znsDomain.domain?.name ?? ''}</h1>
						<span>
							{domain.length > 0 ? `0://wilder.${domain.substring(1)}` : ''}
						</span>
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
					</div>
					{price()}
					{actionButtons()}
				</div>
			</div>
			<div className={styles.Horizontal} style={{ marginTop: 20 }}>
				<div
					className={`${styles.Box} ${styles.Story} blur border-primary border-rounded`}
				>
					<h4>Story</h4>
					<p>{znsDomain.domain?.description ?? ''}</p>
				</div>
				<div
					className={`${styles.Box} ${styles.Contract} blur border-primary border-rounded`}
				>
					<h4>Token Id</h4>
					<p className="glow-text-white">
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
							width: 140,
							fontWeight: 700,
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
