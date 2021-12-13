/* eslint-disable react-hooks/exhaustive-deps */
//- React Imports
import React, { useState, useEffect } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core'; // Wallet data
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'; // Wallet data

//- Library Imports
import { Metadata, Bid, Maybe } from 'lib/types';
import { useZnsContracts } from 'lib/contracts';
import { getMetadata } from 'lib/metadata';
import { ethers } from 'ethers';
import { ERC20 } from 'types';
import { useBidProvider } from 'lib/providers/BidProvider';

//- Component Imports
import {
	FutureButton,
	Member,
	LoadingIndicator,
	NFTMedia,
	WalletInteraction,
	Tooltip,
} from 'components';

//- Style Imports
import styles from './MakeABuy.module.scss';
import useCurrency from 'lib/hooks/useCurrency';

const MakeABuy: React.FC<any> = ({ domain }) => {
	//- Bid hooks
	const { getBidsForDomain } = useBidProvider();

	// Wild to usd
	const { wildPriceUsd } = useCurrency();

	///////////
	// State //
	///////////

	const [ShowWalletInteraction, setShowWalletInteraction] = useState(false);
	const [ShowProccesing, setShowProccesing] = useState(false);

	const [buyNowPrice, setBuyNowPrice] = useState<string>(
		'1000000000000000000000',
	);
	const [buyNowPriceUsd, setBuyNowPriceUsd] = useState<number | undefined>();
	const [currentHighestBid, setCurrentHighestBid] = useState<Bid | undefined>();
	const [currentHighestBidUsd, setCurrentHighestBidUsd] = useState<
		number | undefined
	>();
	const [wildBalance, setWildBalance] = useState<number | undefined>();
	const [domainMetadata, setDomainMetadata] = useState<Metadata | undefined>();

	// Loading States
	const [isMetamaskWaiting, setIsMetamaskWaiting] = useState(false);

	//- Web3 Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { account } = walletContext;

	const znsContracts = useZnsContracts()!;
	const wildContract: ERC20 = znsContracts.wildToken;

	const isBuyValid =
		(buyNowPrice &&
			wildBalance &&
			Number(ethers.utils.formatEther(buyNowPrice)) <= wildBalance &&
			Number(ethers.utils.formatEther(buyNowPrice)) > 0) === true;

	///////////////
	// Functions //
	///////////////

	const buyNft = async () => {
		// todo implement
	};

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		if (!account) {
			return;
		}

		setIsMetamaskWaiting(false);

		const fetchTokenBalance = async () => {
			const balance = await wildContract.balanceOf(account);
			setWildBalance(parseInt(ethers.utils.formatEther(balance), 10));
		};

		fetchTokenBalance();
	});

	useEffect(() => {
		let isSubscribed = true;

		const loadDomainData = async () => {
			const metadata = await getMetadata(domain.metadata);
			if (!metadata) return;

			if (isSubscribed) {
				setDomainMetadata(metadata);
			}
		};

		loadDomainData();

		return () => {
			isSubscribed = false;
		};
	}, [domain, wildPriceUsd]);

	useEffect(() => {
		let isSubscribed = true;

		const getCurrentHighestBid = async () => {
			// Get highest bid
			const allBids = await getBidsForDomain(domain);

			if (!allBids || allBids.length === 0) {
				return;
			}
			const highestBid = allBids.reduce(function (prev, current) {
				return prev.amount > current.amount ? prev : current;
			});

			if (isSubscribed) {
				setCurrentHighestBid(highestBid);
				if (wildPriceUsd > 0) {
					setCurrentHighestBidUsd(highestBid.amount * wildPriceUsd);

					setBuyNowPriceUsd(
						Number(ethers.utils.formatEther(buyNowPrice)) * wildPriceUsd,
					);
				}
			}
		};

		getCurrentHighestBid();

		return () => {
			isSubscribed = false;
		};
	}, [domain, wildPriceUsd]);

	/////////////////////
	// React Fragments //
	/////////////////////

	const header = () => (
		<>
			<div className={styles.Header}>
				<h1 className={`glow-text-white`}>Buy Now</h1>
				<h4 className="glow-text-white">
					Please review the information and the art to make sure you are
					purchasing the right NFT.
				</h4>
			</div>
		</>
	);

	const nft = () => (
		<div className={styles.NFT}>
			<NFTMedia
				alt="Bid NFT preview"
				style={{ objectFit: 'contain', position: 'absolute', zIndex: 2 }}
				ipfsUrl={domainMetadata?.image_full || domainMetadata?.image || ''}
				size="small"
			/>
		</div>
	);

	const highestBid = () => {
		return (
			<div className={styles.Price}>
				<h3>Highest Bid</h3>
				<div className={styles.Value}>
					{currentHighestBid !== undefined && currentHighestBid.amount! > 0 && (
						<h4>
							{Intl.NumberFormat('en-US', {
								minimumFractionDigits: 2,
							}).format(currentHighestBid.amount)}
							{' WILD'}
						</h4>
					)}
					{currentHighestBidUsd !== undefined && currentHighestBidUsd > 0 && (
						<span>
							{Intl.NumberFormat('en-US', {
								style: 'currency',
								currency: 'USD',
								minimumFractionDigits: 2,
							}).format(currentHighestBidUsd)}
						</span>
					)}
				</div>
			</div>
		);
	};

	const buyNow = () => {
		return (
			<div className={styles.Price}>
				<h3>Buy Now Price</h3>
				<div className={styles.Value}>
					{buyNowPrice !== undefined &&
						Number(ethers.utils.formatEther(buyNowPrice)) > 0 && (
							<h4>
								{Intl.NumberFormat('en-US', {
									minimumFractionDigits: 2,
								}).format(Number(ethers.utils.formatEther(buyNowPrice)))}
								{' WILD'}
							</h4>
						)}
					{buyNowPriceUsd !== undefined && buyNowPriceUsd > 0 && (
						<span>
							{Intl.NumberFormat('en-US', {
								style: 'currency',
								currency: 'USD',
								minimumFractionDigits: 2,
							}).format(buyNowPriceUsd)}
						</span>
					)}
				</div>
			</div>
		);
	};

	const details = () => (
		<div className={styles.Details}>
			<div>
				<h2>{domainMetadata?.title}</h2>
				<span className={styles.Domain}>0://{domain.name}</span>
			</div>
			<Member
				id={domain?.minter?.id || ''}
				name={''}
				image={''}
				subtext={'Creator'}
			/>
			{highestBid()}
			{buyNow()}
		</div>
	);

	const loadingWildBalance = wildBalance === undefined;

	const buy = () => {
		let buyTooHighWarning: Maybe<React.ReactFragment> = null;

		if (
			!loadingWildBalance &&
			Number(ethers.utils.formatEther(buyNowPrice)) > wildBalance!
		) {
			buyTooHighWarning = (
				<>
					<p className={styles.Error} style={{ paddingTop: '16px' }}>
						You don't have enough WILD to buy this NFT
					</p>
				</>
			);
		}

		return (
			<>
				<div className={styles.Section}>
					{nft()}
					{details()}
				</div>
				<div>
					{domain.owner.id.toLowerCase() === account?.toLowerCase() && (
						<p className={styles.Error} style={{ paddingTop: '16px' }}>
							You can not buy on your own domain
						</p>
					)}
					{domain.owner.id.toLowerCase() !== account?.toLowerCase() && (
						<>
							{loadingWildBalance && (
								<>
									<LoadingIndicator text="Checking WILD Balance" />
								</>
							)}
							{!loadingWildBalance && (
								<>
									<div className={styles.Estimate}>
										<span>Your Balance</span>
										<h4>{Number(wildBalance).toLocaleString()} WILD</h4>
									</div>
									{buyTooHighWarning}
									<FutureButton
										style={{
											height: 36,
											borderRadius: 18,
											textTransform: 'uppercase',
											margin: '32px auto 0 auto',
										}}
										loading={isBuyValid}
										onClick={() => {
											if (!isBuyValid) {
												return;
											}

											buyNft();
										}}
										glow={isBuyValid}
									>
										Confirm
									</FutureButton>
								</>
							)}
						</>
					)}
				</div>
			</>
		);
	};

	const proccessing = () => {
		return (
			<div className={styles.Processing}>
				<h2 className={styles.Header}>
					Buy Now
					<div className={styles.infoButton}>
						<Tooltip text="This is a long info message">
							<div>
								<svg
									width="6"
									height="9"
									viewBox="0 0 6 9"
									fill="none"
									xmlns="http://www.w3.org/2000/svg"
								>
									<path
										d="M2.25169 6.45316H3.27209V6.40153C3.28909 5.33461 3.5612 4.86998 4.30949 4.39675C5.05779 3.93642 5.49996 3.2739 5.49996 2.32314C5.49996 0.98088 4.53058 0 3.03399 0C1.65645 0 0.563775 0.860421 0.5 2.32314H1.57142C1.6352 1.30784 2.33672 0.894837 3.03399 0.894837C3.83331 0.894837 4.47956 1.4283 4.47956 2.27151C4.47956 2.95555 4.09266 3.44598 3.59521 3.75143C2.76189 4.26338 2.26444 4.76243 2.25169 6.40153V6.45316ZM2.7959 9C3.21682 9 3.5612 8.65153 3.5612 8.22562C3.5612 7.79971 3.21682 7.45124 2.7959 7.45124C2.37499 7.45124 2.0306 7.79971 2.0306 8.22562C2.0306 8.65153 2.37499 9 2.7959 9Z"
										fill="white"
									/>
								</svg>
							</div>
						</Tooltip>
					</div>
				</h2>

				<div className={styles.proccessingInfo}>
					<p>
						Buying NFT. This may take up to 20 mins... Please do not close this
						window or refresh the page.
					</p>
				</div>
			</div>
		);
	};

	return (
		<div className={`${styles.Container} border-primary border-rounded blur`}>
			{header()}
			{buy()}
			{ShowProccesing && proccessing()}
			{ShowWalletInteraction ? <WalletInteraction /> : ''}
		</div>
	);
};

export default MakeABuy;
