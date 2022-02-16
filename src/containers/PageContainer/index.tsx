import React, { FC, useMemo } from 'react';
import { useState, useEffect, useRef } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { useEagerConnect } from 'lib/hooks/provider-hooks';

//- Library Imports
import { useChainSelector } from 'lib/providers/ChainSelectorProvider';
import useNotification from 'lib/hooks/useNotification';
import useMint from 'lib/hooks/useMint';
import useMvpVersion from 'lib/hooks/useMvpVersion';

//- Style Imports
import styles from './PageContainer.module.scss';

//- Icon Imports
import userIcon from 'assets/user.svg';
import wilderIcon from 'assets/WWLogo_SVG.svg';

//- Components & Containers
import {
	ConnectToWallet,
	FutureButton,
	TitleBar,
	TooltipLegacy,
	IconButton,
	Overlay,
	NotificationDrawer,
	NumberButton,
	MintPreview,
	TransferPreview,
	Spinner,
	SideBar,
} from 'components';

import { BuyTokenRedirect, ProfileModal } from 'containers';

//- Library Imports
import { useTransfer } from 'lib/hooks/useTransfer';
import { MintNewNFT } from 'containers';
import { useStakingProvider } from 'lib/providers/StakingRequestProvider';
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';
import { NavBarProvider } from 'lib/providers/NavBarProvider';

enum Modal {
	Bid,
	Mint,
	Transfer,
	Wallet,
}

const PageContainer: FC = ({ children }) => {
	///////////////////
	// Web3 Handling //
	///////////////////

	//- Wallet Data
	const walletContext = useWeb3React<Web3Provider>();

	const { account, active, chainId } = walletContext;
	const triedEagerConnect = useEagerConnect(); // This line will try auto-connect to the last wallet only if the user hasn't disconnected
	//- Chain Selection (@todo: refactor to provider)
	const chainSelector = useChainSelector();

	React.useEffect(() => {
		if (chainId && chainSelector.selectedChain !== chainId) {
			chainSelector.selectChain(chainId);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [chainId]);

	//- Domain Data
	const { domain: znsDomain, loading, refetch } = useCurrentDomain();

	//- Version Data
	const { mvpVersion } = useMvpVersion();
	const isMvpPrototype = mvpVersion === 3;

	////////////////////////
	// Browser Navigation //
	////////////////////////

	//- Browser Navigation State
	const history = useHistory();
	const location = useLocation();
	const globalDomain = useCurrentDomain();
	const domain = useMemo(() => location.pathname, [location.pathname]);
	const [forwardDomain, setForwardDomain] = useState<string | undefined>();
	const lastDomain = useRef<string>();
	const canGoBack = domain !== undefined && domain !== '/';
	const canGoForward = !!forwardDomain;

	// Force to go back to home if invalid domain
	React.useEffect(() => {
		if (!loading && !znsDomain) {
			return history.push(globalDomain.app);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [znsDomain, loading, globalDomain.app]);

	//- Minting State
	const { minting, minted } = useMint();
	const stakingProvider = useStakingProvider();

	const statusCount = minting.length + stakingProvider.requesting.length;
	const showStatus =
		minting.length +
		minted.length +
		stakingProvider.requesting.length +
		stakingProvider.requested.length;

	const { transferring } = useTransfer();

	//- Notification State
	const { addNotification } = useNotification();

	//- Page State
	const [hasLoaded, setHasLoaded] = useState(false);
	const [pageWidth, setPageWidth] = useState<number>(0);

	//- Overlay State
	const [modal, setModal] = useState<Modal | undefined>();
	const [isSearchActive, setIsSearchActive] = useState(false);

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
			history.push(domain.slice(0, domain.lastIndexOf('.')));
		} else {
			history.push(domain.slice(0, domain.lastIndexOf('/')));
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

	const handleResize = () => {
		setPageWidth(window.innerWidth);
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

	/* Find the freshly minted NFT */
	useEffect(() => {
		if (refetch) {
			refetch();
		}
	}, [minted, refetch, stakingProvider.fulfilled]);

	/* Handle notification for wallet changes */
	useEffect(() => {
		//wallet connect wont do this automatically if session its ended from phone
		if (
			(localStorage.getItem('chosenWallet') === 'walletconnect' ||
				localStorage.getItem('chosenWallet') === 'metamask' ||
				localStorage.getItem('chosenWallet') === 'coinbase' ||
				localStorage.getItem('chosenWallet') === 'portis' ||
				localStorage.getItem('chosenWallet') === 'fortmatic') &&
			!active &&
			triedEagerConnect
		) {
			setTimeout(async () => {
				localStorage.removeItem('chosenWallet');
			}, 2000);
		}
		if (triedEagerConnect)
			addNotification(active ? 'Wallet connected.' : 'Wallet disconnected.');

		// Check if we need to close a modal
		if (modal === Modal.Transfer || modal === Modal.Mint) {
			closeModal();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [active]);

	useEffect(() => {
		// TODO: Clean this whole hook up
		if (znsDomain) {
			// Set the domain data for table view
			setHasLoaded(true);
		}
		window.scrollTo({
			top: -1000,
			behavior: 'smooth',
		});
	}, [znsDomain, hasLoaded]);

	/////////////////////
	// React Fragments //
	/////////////////////

	const modals = () => (
		<>
			{/* Overlays */}
			<NotificationDrawer />
			<ProfileModal />
			<Overlay style={{ zIndex: 3 }} open={isSearchActive} onClose={() => { }}>
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
		</>
	);

	return (
		<NavBarProvider>
			{pageWidth > 1000 && modals()}
			<div
				className="page-spacing"
				style={{
					opacity: hasLoaded ? 1 : 0,
					transition: 'opacity 0.2s ease-in-out',
				}}
			>
				{/* Home icon always goes to the market */}
				<div className={styles.Wilder}>
					<img
						alt="home icon"
						src={wilderIcon}
						onClick={() => history.push('/market')}
					/>
				</div>
				<TitleBar
					// domain={domain}
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
											width: '100%',
											verticalAlign: 'center',
											height: '18px',
											marginLeft: '15px',
											whiteSpace: 'nowrap',
										}}
										className={styles.Message}
									>
										Trying to connect {localStorage.getItem('chosenWallet')}
									</p>
								</div>
							</FutureButton>
						)}

						{!account && !localStorage.getItem('chosenWallet') && (
							<>
								<FutureButton glow onClick={openWallet}>
									Connect {pageWidth > 900 && 'Wallet'}
								</FutureButton>
								<BuyTokenRedirect />
							</>
						)}

						{account && !isSearchActive && (
							<>
								{/* Mint button */}
								{isOwnedByUser && isMvpPrototype && (
									<FutureButton
										style={{ padding: '0px 12px' }}
										glow={account != null}
										onClick={() => {
											account != null
												? openMint()
												: addNotification('Please connect your wallet.');
										}}
										loading={loading}
									>
										MINT
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
											onClick={() => { }}
										/>
									</TooltipLegacy>
								) : null}

								{/* Transfer Progress button */}
								{transferring.length > 0 && (
									<TooltipLegacy content={<TransferPreview />}>
										<NumberButton
											rotating={transferring.length > 0}
											number={transferring.length}
											onClick={() => { }}
										/>
									</TooltipLegacy>
								)}

								{/* Buy token from external urls */}
								<BuyTokenRedirect walletConnected />

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
				<SideBar />
				{/* TODO: Encapsulate this */}
				<div>{children}</div>
			</div>
		</NavBarProvider>
	);
};

export default PageContainer;
