//- React Imports
import React, { useState, useEffect, useRef, createRef } from 'react';
import { Spring, animated } from 'react-spring';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { BigNumber } from 'ethers';

//- Component Imports
import { ArrowLink, FutureButton, Member, NFTMedia, Overlay } from 'components';
import { BidButton, MakeABid } from 'containers';

//- Library Imports
import { randomName, randomImage } from 'lib/random';
import useNotification from 'lib/hooks/useNotification';
import { useBidProvider } from 'lib/providers/BidProvider';
import { useCurrencyProvider } from 'lib/providers/CurrencyProvider';
import { toFiat } from 'lib/currency';
import { chainIdToNetworkType, getEtherscanUri } from 'lib/network';
import { useZnsContracts } from 'lib/contracts';
import { getDomainId } from 'lib/utils';
import { useZnsDomain } from 'lib/hooks/useZnsDomain';
import { useDomainsTransfers } from 'lib/hooks/zNSDomainHooks';
import { Attribute, Bid, transfersData, transferDto } from 'lib/types';

//- Style Imports
import styles from './NFTView.module.css';

//- Asset Imports
import galaxyBackground from './assets/galaxy.png';
import copyIcon from './assets/copy-icon.svg';

const moment = require('moment');

type NFTViewProps = {
	domain: string;
	onTransfer: () => void;
};

const NFTView: React.FC<NFTViewProps> = ({ domain, onTransfer }) => {
	//////////////////
	// State & Data //
	//////////////////

	const isMounted = useRef(false);
	const blobCache = useRef<string>();
	const { addNotification } = useNotification();
	const { wildPriceUsd } = useCurrencyProvider();

	//- Page State
	const [isOwnedByYou, setIsOwnedByYou] = useState(false); // Is the current domain owned by you?
	const [isBidOverlayOpen, setIsBidOverlayOpen] = useState(false);
	const [bids, setBids] = useState<Bid[] | undefined>();
	const [highestBid, setHighestBid] = useState<Bid | undefined>();
	const [highestBidUsd, setHighestBidUsd] = useState<number | undefined>();
	const [backgroundBlob, setBackgroundBlob] = useState<string | undefined>(
		blobCache.current,
	);
	const [isShowMoreAtrributes, setIsShowMoreAttributes] =
		useState<boolean>(false);
	const [containerHeight, setContainerHeight] = useState(0);

	//- Web3 Domain Data
	const domainId = getDomainId(domain.substring(1));
	const domainIdInteger = BigNumber.from(domainId); //domainId as bignumber used to redirect to etherscan link

	const znsDomain = useZnsDomain(domainId);

	const { getBidsForDomain } = useBidProvider();

	//- Web3 Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { account, active, chainId } = walletContext;

	const networkType = chainIdToNetworkType(chainId);
	const contracts = useZnsContracts();
	const registrarAddress = contracts ? contracts.registry.address : '';

	const etherscanBaseUri = getEtherscanUri(networkType);
	const etherscanLink = `${etherscanBaseUri}token/${registrarAddress}?a=${domainIdInteger.toString()}`;

	//Transfers and mint data from nft
	//- Calls the hook with a polling interval to update the data

	const transfersPollingInterval: number = 5000;
	const transfersDto = useDomainsTransfers(domainId, transfersPollingInterval)
		.data as transfersData;

	///////////////
	// Functions //
	///////////////

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
		if (!znsDomain.domain || isOwnedByYou || !active) return;
		setIsBidOverlayOpen(true);
	};

	const closeBidOverlay = () => setIsBidOverlayOpen(false);

	const onBid = async () => {
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
						{Number(highestBid.amount.toFixed(2)).toLocaleString()} WILD{' '}
						{highestBidUsd !== undefined && wildPriceUsd > 0 && (
							<span className={styles.Fiat}>(${toFiat(highestBidUsd)})</span>
						)}
					</span>
				</div>
			)}
		</>
	);

	const history = () => {
		// @todo this is very gross, rewrite
		const both = [bids || [], transfersDto?.domainTransferreds || []].flat();
		const sorted = both.sort((a, b) => {
			const aVal =
				Number((a as transferDto).timestamp) * 1000 ||
				(a as Bid).date.getTime() ||
				0;
			const bVal =
				Number((b as transferDto).timestamp) * 1000 ||
				(b as Bid).date.getTime() ||
				0;
			return bVal - aVal;
		});
		const allHistoryItems = sorted.slice(0, sorted.length); // the last item is always the doubled up mint transfer
		return (
			<section
				className={`${styles.History} ${styles.Box} blur border-primary border-rounded`}
			>
				<h4>History</h4>
				{!bids && (
					<div className={styles.Loading}>
						<span>Loading domain history</span>
					</div>
				)}
				{bids && sorted.length > 0 && (
					<ul>
						{allHistoryItems.map((item: Bid | transferDto, i: number) =>
							historyItem(item, i, i === allHistoryItems.length - 1),
						)}
					</ul>
				)}
			</section>
		);
	};

	const historyItem = (
		item: Bid | transferDto,
		i: number,
		isLastItem: boolean,
	) => {
		const isBid = (item as Bid).bidderAccount !== undefined;

		if (isBid) {
			const bid = item as Bid;
			return (
				<li className={styles.Bid} key={i}>
					<div>
						<b>
							<a
								className="alt-link"
								href={`https://etherscan.io/address/${bid.bidderAccount}`}
								target="_blank"
								rel="noreferrer"
							>{`${bid.bidderAccount.substring(
								0,
								4,
							)}...${bid.bidderAccount.substring(
								bid.bidderAccount.length - 4,
							)}`}</a>
						</b>{' '}
						made an offer of <b>{Number(bid.amount).toLocaleString()} WILD</b>
					</div>
					<div className={styles.From}>
						<b>{moment(bid.date).fromNow()}</b>
					</div>
				</li>
			);
		} else if (isLastItem) {
			const transfer = item as transferDto;
			return (
				<li className={styles.Bid} key={i}>
					<div>
						<b>Domain minted</b>{' '}
					</div>
					<div className={styles.From}>
						<b>{moment(Number(transfer.timestamp) * 1000).fromNow()}</b>
					</div>
				</li>
			);
		} else {
			const transfer = item as transferDto;
			return (
				<li className={styles.Bid} key={i}>
					<div>
						<b>
							<a
								className="alt-link"
								href={`https://etherscan.io/address/${transfer.from.id}`}
								target="_blank"
								rel="noreferrer"
							>
								{`${transfer.from.id.substring(
									0,
									4,
								)}...${transfer.from.id.substring(
									transfer.from.id.length - 4,
								)}`}{' '}
							</a>
						</b>
						transferred ownership to{' '}
						<a
							className="alt-link"
							href={`https://etherscan.io/address/${transfer.to.id}`}
							target="_blank"
							rel="noreferrer"
						>
							<b>
								{`${transfer.to.id.substring(
									0,
									4,
								)}...${transfer.to.id.substring(transfer.to.id.length - 4)}`}
							</b>{' '}
						</a>
					</div>
					<div className={styles.From}>
						<b>{moment(Number(transfer.timestamp) * 1000).fromNow()}</b>
					</div>
				</li>
			);
		}
	};

	const actionButtons = () => (
		<div className={styles.Buttons}>
			<FutureButton
				glow={isOwnedByYou}
				onClick={() => isOwnedByYou && onTransfer()}
				style={{ height: 36, borderRadius: 18 }}
			>
				Transfer Ownership
			</FutureButton>
			<BidButton
				glow={!isOwnedByYou && active}
				onClick={openBidOverlay}
				style={{ height: 36, borderRadius: 18 }}
			>
				Make A Bid
			</BidButton>
		</div>
	);

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
					/>
				</div>
				<div className={styles.Info}>
					<div className={styles.Details}>
						<div>
							<h1 className="glow-text-white">
								{znsDomain.domain?.title ?? ''}
							</h1>
							<span>
								{domain.length > 0 ? `0://wilder.${domain.substring(1)}` : ''}
							</span>
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
					</div>
					{price()}

					{actionButtons()}
					{backgroundBlob !== undefined && (
						<img
							alt="NFT panel background"
							src={backgroundBlob}
							className={styles.Bg}
						/>
					)}
				</div>
			</div>

			{attributes()}
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
