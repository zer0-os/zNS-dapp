/* eslint-disable react-hooks/exhaustive-deps */
//- React Imports
import React, { useMemo } from 'react';
import { useState, useEffect, useRef } from 'react';
import { Spring, animated } from 'react-spring';
import { useHistory, useLocation } from 'react-router-dom';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { useEagerConnect } from 'lib/hooks/provider-hooks';

//- Library Imports
import { useChainSelector } from 'lib/providers/ChainSelectorProvider';
import useNotification from 'lib/hooks/useNotification';
import { useMintProvider } from 'lib/providers/MintProvider';
import { formatNumber, formatEthers } from 'lib/utils';

//- Style Imports
import styles from './ZNS.module.scss';

//- Icon Imports
import userIcon from 'assets/user.svg';

//- Components & Containers
import {
	ConnectToWallet,
	FutureButton,
	FilterBar,
	TitleBar,
	TooltipLegacy,
	IconButton,
	Overlay,
	NotificationDrawer,
	NumberButton,
	MintPreview,
	TransferPreview,
	Spinner,
	StatsWidget,
} from 'components';

import {
	SubdomainTable,
	CurrentDomainPreview,
	ProfileModal,
	// Temporarily removed raffle
	WheelsRaffle,
} from 'containers';

//- Library Imports
import { useTransferProvider } from 'lib/providers/TransferProvider';
import { MintNewNFT, NFTView, TransferOwnership } from 'containers';
import { useStakingProvider } from 'lib/providers/StakingRequestProvider';
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';
import { DomainMetrics } from '@zero-tech/zns-sdk';
import { ethers } from 'ethers';
import useCurrency from 'lib/hooks/useCurrency';
import useMatchMedia from 'lib/hooks/useMatchMedia';

type ZNSProps = {
	domain: string;
	version?: number;
	isNftView?: boolean;
};

enum Modal {
	Bid,
	Mint,
	Transfer,
	Wallet,
}

// @TODO: Rewrite this whole page

const ZNS: React.FC<ZNSProps> = ({ domain, version, isNftView: nftView }) => {
	// TODO: Need to handle domains that don't exist!

	///////////////////
	// Web3 Handling //
	///////////////////

	//- Wallet Data
	const walletContext = useWeb3React<Web3Provider>();

	const { account, active, chainId } = walletContext;
	const triedEagerConnect = useEagerConnect(); // This line will try auto-connect to the last wallet only if the user hasnt disconnected

	const sdk = useZnsSdk();
	const { wildPriceUsd } = useCurrency();

	//- Chain Selection (@todo: refactor to provider)
	const chainSelector = useChainSelector();
	React.useEffect(() => {
		if (chainId && chainSelector.selectedChain !== chainId) {
			chainSelector.selectChain(chainId);
		}
	}, [chainId]);

	//- Domain Data
	const { domain: znsDomain, loading, refetch } = useCurrentDomain();

	////////////////////////
	// Browser Navigation //
	////////////////////////

	//- Browser Navigation State
	const history = useHistory();
	const location = useLocation();
	const [forwardDomain, setForwardDomain] = useState<string | undefined>();
	const lastDomain = useRef<string>();
	const canGoBack = domain !== undefined && domain !== '/';
	const canGoForward = !!forwardDomain;

	// Force to go back to home if invalid domain
	React.useEffect(() => {
		if (!loading) {
			if (!znsDomain) {
				history.push('/');
				return;
			}
		}
	}, [znsDomain, loading]);

	const previewCardRef = useRef<HTMLDivElement>(null);

	//- Minting State
	const mintingProvider = useMintProvider();
	const stakingProvider = useStakingProvider();

	const statusCount =
		mintingProvider.minting.length + stakingProvider.requesting.length;
	const showStatus =
		mintingProvider.minting.length +
		mintingProvider.minted.length +
		stakingProvider.requesting.length +
		stakingProvider.requested.length;

	const { transferring } = useTransferProvider();

	//- Notification State
	const { addNotification } = useNotification();

	const isMobile = useMatchMedia('phone');
	const isTabletPortrait = useMatchMedia('(max-width: 768px)');
	const isMobilePortrait = useMatchMedia('(max-width: 520px)');

	//- Page State
	const [hasLoaded, setHasLoaded] = useState(false);
	const [showDomainTable, setShowDomainTable] = useState(true);
	const [isNftView, setIsNftView] = useState(nftView === true);
	const [pageWidth, setPageWidth] = useState<number>(0);

	//- Overlay State
	const [modal, setModal] = useState<Modal | undefined>();
	const [isSearchActive, setIsSearchActive] = useState(false);

	const [tradeData, setTradeData] = useState<DomainMetrics | undefined>();
	const [statsLoaded, setStatsLoaded] = useState(false);

	//- Data
	const isOwnedByUser: boolean =
		znsDomain?.owner?.id.toLowerCase() === account?.toLowerCase();

	///////////////
	// Functions //
	///////////////

	// Go back through page history
	const back = () => {
		const lastIndex = domain.lastIndexOf('.');
		if (lastIndex > 0) {
			const to = domain.slice(0, domain.lastIndexOf('.'));
			history.push(to);
		} else {
			history.push('/');
		}
	};

	// Go forward through page history
	const forward = () => {
		if (forwardDomain) history.push(forwardDomain);
		setForwardDomain(undefined);
	};

	const scrollToTop = () => {
		document.querySelector('body')?.scrollTo(0, 0);
	};

	/////////////////////
	// Overlay Toggles //
	/////////////////////

	const closeModal = () => {
		setModal(undefined);
	};
	const openMint = () => setModal(Modal.Mint);

	const openProfile = () => {
		const params = new URLSearchParams(location.search);
		params.set('profile', 'true');
		history.push({
			pathname: domain,
			search: params.toString(),
		});
	};

	const openWallet = () => {
		setModal(Modal.Wallet);
	};
	const openTransferOwnershipModal = () => {
		setModal(Modal.Transfer);
	};

	const handleResize = () => {
		setPageWidth(window.innerWidth);
	};

	const getTradeData = async () => {
		if (znsDomain) {
			const metricsData = await sdk.instance.getDomainMetrics([znsDomain.id]);
			if (metricsData && metricsData[znsDomain.id]) {
				setTradeData(metricsData[znsDomain.id]);
			}
			setStatsLoaded(true);
		}
	};

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		window.addEventListener('resize', handleResize);
		handleResize();
		return () => {
			window.removeEventListener('resize', handleResize);
		};
	}, []);

	/* Handles the back/forward history */
	useEffect(() => {
		if (lastDomain.current) {
			if (lastDomain.current.length > domain.length) {
				setForwardDomain(lastDomain.current);
			} else {
				setForwardDomain(undefined);
			}
		}
		lastDomain.current = domain;
		scrollToTop();
	}, [domain]);

	/* WIP */
	useEffect(() => {
		scrollToTop();
		setShowDomainTable(!isNftView);
	}, [isNftView]);

	/* Also WIP */
	useEffect(() => {
		setIsNftView(nftView === true);
	}, [nftView]);

	/* Find the freshly minted NFT */
	useEffect(() => {
		if (refetch) {
			refetch();
		}
	}, [mintingProvider.minted, stakingProvider.fulfilled]);

	/* Handle notification for wallet changes */
	useEffect(() => {
		//wallet connect wont do this automatically if session its ended from phone
		if (
			localStorage.getItem('chosenWallet') === 'walletconnect' &&
			!active &&
			triedEagerConnect
		) {
			localStorage.removeItem('walletconnect');
			localStorage.removeItem('chosenWallet');
		}
		if (triedEagerConnect)
			addNotification(active ? 'Wallet connected.' : 'Wallet disconnected.');

		// Check if we need to close a modal
		if (modal === Modal.Transfer || modal === Modal.Mint) {
			closeModal();
		}
	}, [active]);

	useEffect(() => {
		// TODO: Clean this whole hook up
		if (znsDomain) {
			// Set the domain data for table view
			setIsNftView(nftView === true || znsDomain.subdomains.length === 0);
			setHasLoaded(true);
		}
		window.scrollTo({
			top: -1000,
			behavior: 'smooth',
		});
	}, [znsDomain, hasLoaded]);

	useEffect(() => {
		setStatsLoaded(false);
		if (znsDomain && znsDomain.id) {
			getTradeData();
		}
	}, [znsDomain]);

	/////////////////////
	// React Fragments //
	/////////////////////

	const nftStats = () => {
		let width = '24.2%';
		if (isMobilePortrait) {
			width = '100%';
		} else if (isTabletPortrait) {
			width = '32%';
		}

		const data = [
			{
				fieldName: 'Items in Domain',
				title: tradeData?.items ? formatNumber(tradeData.items) : 0,
				isHidden: isMobilePortrait,
			},
			{
				fieldName: 'Total Owners',
				title: tradeData?.holders ? formatNumber(tradeData.holders) : 0,
				isHidden: isMobile || isTabletPortrait,
			},
			{
				fieldName: 'Floor Price',
				title: `${
					tradeData?.lowestSale ? formatEthers(tradeData?.lowestSale) : 0
				} WILD`,
				subTitle:
					wildPriceUsd > 0
						? `$${
								tradeData?.lowestSale
									? formatNumber(
											Number(ethers.utils.formatEther(tradeData?.lowestSale)) *
												wildPriceUsd,
									  )
									: 0
						  }`
						: '',
			},
			{
				fieldName: 'Volume',
				title: (tradeData?.volume as any)?.all
					? `${formatEthers((tradeData?.volume as any)?.all)} WILD`
					: '',
				subTitle:
					wildPriceUsd > 0
						? `$${
								(tradeData?.volume as any)?.all
									? formatNumber(
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
									className="normalView"
									fieldName={item.fieldName}
									isLoading={!statsLoaded}
									title={item.title}
									subTitle={item.subTitle}
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

	const previewCard = () => {
		const isVisible = domain !== '/' && !isNftView;
		let to;
		if (isVisible && previewCardRef) {
			// If should be visible, slide down
			to = { opacity: 1, marginTop: 0, marginBottom: 0 };
		} else {
			// If root view, slide up
			to = {
				opacity: 0,
				marginTop: -(previewCardRef?.current?.clientHeight || 0) - 12,
				marginBottom: 16,
			};
		}

		return (
			<>
				{/* Preview Card */}
				<Spring to={to}>
					{(styles) => (
						<animated.div style={styles}>
							<div ref={previewCardRef}>
								<CurrentDomainPreview />
							</div>
						</animated.div>
					)}
				</Spring>
			</>
		);
	};

	const modals = () => (
		<>
			{/* Overlays */}
			<NotificationDrawer />
			<ProfileModal />
			<Overlay style={{ zIndex: 3 }} open={isSearchActive} onClose={() => {}}>
				<></>
			</Overlay>
			{modal === Modal.Wallet && (
				<Overlay centered open={modal === Modal.Wallet} onClose={closeModal}>
					<ConnectToWallet onConnect={closeModal} />
				</Overlay>
			)}
			{modal === Modal.Mint && (
				<Overlay open onClose={closeModal}>
					<MintNewNFT
						onMint={closeModal}
						domainName={domain}
						domainId={znsDomain ? znsDomain.id : ''}
						domainOwner={znsDomain ? znsDomain.owner.id : ''}
						subdomains={
							(znsDomain?.subdomains?.map(
								(sub: any) => sub.name,
							) as string[]) || []
						}
					/>
				</Overlay>
			)}
			{modal === Modal.Transfer && (
				<TransferOwnership
					metadataUrl={znsDomain?.metadata ?? ''}
					domainName={domain}
					domainId={znsDomain?.id ?? ''}
					onTransfer={closeModal}
					creatorId={znsDomain?.minter?.id || ''}
					ownerId={znsDomain?.owner?.id || ''}
				/>
			)}
		</>
	);

	const subTable = useMemo(() => {
		return (
			<SubdomainTable
				style={{ marginTop: 16 }}
				domainName={domain}
				isNftView={isNftView}
			/>
		);
	}, [domain, isNftView]);

	////////////
	// Render //
	////////////

	return (
		<>
			{pageWidth > 1000 && modals()}
			{/* ZNS Content */}
			<div
				className="page-spacing"
				style={{
					opacity: hasLoaded ? 1 : 0,
					transition: 'opacity 0.2s ease-in-out',
					paddingTop: 145,
				}}
			>
				{/* Nav Bar */}
				{/* TODO: Make a more generic Nav component and nest FilterBar and TitleBar */}
				<FilterBar
					style={
						isSearchActive
							? { zIndex: isSearchActive ? 100 : 10, background: 'none' }
							: {}
					}
					onSelect={() => {
						history.push('/');
					}}
					filters={!isSearchActive ? ['Everything'] : []}
				>
					<TitleBar
						domain={domain}
						canGoBack={canGoBack}
						canGoForward={canGoForward}
						onBack={back}
						onForward={forward}
						isSearchActive={isSearchActive}
						setIsSearchActive={setIsSearchActive}
					>
						<>
							{!account && localStorage.getItem('chosenWallet') && (
								<FutureButton glow onClick={() => openWallet()}>
									<div
										style={{
											display: 'flex',
											justifyContent: 'center',
											verticalAlign: 'center',
											alignItems: 'center',
											paddingBottom: '5px',
										}}
									>
										<div
											style={{
												display: 'inline-block',
												width: '10%',
												margin: '0px',
												padding: '0px',
											}}
										>
											<Spinner />
										</div>
										<p
											style={{
												display: 'inline-block',
												width: '90%',
												verticalAlign: 'center',
												height: '18px',
												marginLeft: '15px',
											}}
											className={styles.Message}
										>
											Trying to connect {localStorage.getItem('chosenWallet')}
										</p>
									</div>
								</FutureButton>
							)}
							{!account && !localStorage.getItem('chosenWallet') && (
								<FutureButton glow onClick={openWallet}>
									Connect {pageWidth > 900 && 'Wallet'}
								</FutureButton>
							)}
							{account && !isSearchActive && (
								<>
									{/* Mint button */}
									{isOwnedByUser && (
										<FutureButton
											glow={account != null}
											onClick={() => {
												account != null
													? openMint()
													: addNotification('Please connect your wallet.');
											}}
											loading={loading}
										>
											{pageWidth <= 900 && 'MINT'}
											{pageWidth > 900 && 'MINT NFT'}
										</FutureButton>
									)}

									{/* Status / Long Running Operation Button */}
									{showStatus ? (
										<TooltipLegacy
											content={<MintPreview onOpenProfile={openProfile} />}
										>
											<NumberButton
												rotating={statusCount > 0}
												number={statusCount}
												onClick={() => {}}
											/>
										</TooltipLegacy>
									) : null}

									{/* Transfer Progress button */}
									{transferring.length > 0 && (
										<TooltipLegacy content={<TransferPreview />}>
											<NumberButton
												rotating={transferring.length > 0}
												number={transferring.length}
												onClick={() => {}}
											/>
										</TooltipLegacy>
									)}

									{/* Profile Button */}
									<IconButton
										onClick={openProfile}
										style={{ height: 32, width: 32, borderRadius: '50%' }}
										iconUri={userIcon}
									/>

									{/* TODO: Change the triple dot button to a component */}
									<div className={styles.Dots} onClick={openWallet}>
										<div></div>
										<div></div>
										<div></div>
									</div>
								</>
							)}
						</>
					</TitleBar>
				</FilterBar>

				{/* Temporarily removed Raffle */}
				<WheelsRaffle />

				{!isNftView && (
					<div
						className="background-primary border-primary border-rounded"
						style={{
							background: 'var(--background-primary)',
							overflow: 'hidden',
						}}
					>
						{previewCard()}
						{nftStats()}
						{showDomainTable && subTable}
					</div>
				)}

				{znsDomain && isNftView && (
					<Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
						{(styles) => (
							<animated.div style={styles}>
								<NFTView
									domain={domain}
									onTransfer={openTransferOwnershipModal}
								/>
							</animated.div>
						)}
					</Spring>
				)}
			</div>
		</>
	);
};

export default ZNS;
