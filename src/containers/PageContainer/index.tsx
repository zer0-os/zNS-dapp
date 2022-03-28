import React, { FC, useState, useEffect, useCallback } from 'react';
import { useHistory } from 'react-router-dom';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { useEagerConnect } from 'lib/hooks/provider-hooks';

//- Library Imports
import { useChainSelector } from 'lib/providers/ChainSelectorProvider';
import useNotification from 'lib/hooks/useNotification';
import useMint from 'lib/hooks/useMint';
import { useNavbar } from 'lib/hooks/useNavbar';

//- Style Imports
import styles from './PageContainer.module.scss';

//- Icon Imports
import wilderIcon from 'assets/WWLogo_SVG.svg';

//- Components & Containers
import {
	ConnectToWallet,
	Overlay,
	NotificationDrawer,
	SideBar,
} from 'components';
import { ProfileModal } from 'containers';

//- Library Imports
import { MintNewNFT } from 'containers';
import { useStaking } from 'lib/hooks/useStaking';
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';

//- Constants Imports
import { ROUTES } from 'constants/routes';
import { LOCAL_STORAGE_KEYS } from 'constants/localStorage';
import { WALLETS } from 'constants/wallets';
import { Modal } from './PageContainer.constants';

//- Elements Imports
import { Header } from './elements';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';

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
	const {
		domain: znsDomain,
		domainMetadata,
		loading,
		refetch,
	} = useCurrentDomain();

	const { isSearching } = useNavbar();

	////////////////////////
	// Browser Navigation //
	////////////////////////

	//- Browser Navigation State
	const history = useHistory();
	const globalDomain = useCurrentDomain();

	// Force to go back to home if invalid domain
	useEffect(() => {
		if (!loading && !znsDomain) {
			return history.push(globalDomain.app);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [znsDomain, loading, globalDomain.app]);

	//- Minting State
	const { minted } = useMint();
	const { fulfilled: stakingFulFilled } = useStaking();

	//- Notification State
	const { addNotification } = useNotification();

	//- Page State
	const [hasLoaded, setHasLoaded] = useState(false);
	const [pageWidth, setPageWidth] = useState<number>(0);

	//- Overlay State
	const [modal, setModal] = useState<Modal | undefined>();

	/////////////////////
	// Overlay Toggles //
	/////////////////////

	const openModal = useCallback(
		(modal?: Modal) => () => setModal(modal),
		[setModal],
	);

	const closeModal = () => {
		setModal(undefined);
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

	/* Find the freshly minted NFT */
	useUpdateEffect(() => {
		refetch?.();
	}, [minted, stakingFulFilled, chainSelector.selectedChain]);

	/* Handle notification for wallet changes */
	useEffect(() => {
		//wallet connect wont do this automatically if session its ended from phone
		if (
			(localStorage.getItem(LOCAL_STORAGE_KEYS.CHOOSEN_WALLET) ===
				WALLETS.WALLET_CONNECT ||
				localStorage.getItem(LOCAL_STORAGE_KEYS.CHOOSEN_WALLET) ===
					WALLETS.METAMASK ||
				localStorage.getItem(LOCAL_STORAGE_KEYS.CHOOSEN_WALLET) ===
					WALLETS.COINBASE ||
				localStorage.getItem(LOCAL_STORAGE_KEYS.CHOOSEN_WALLET) ===
					WALLETS.PORTIS ||
				localStorage.getItem(LOCAL_STORAGE_KEYS.CHOOSEN_WALLET) ===
					WALLETS.FORTMATIC) &&
			!active &&
			triedEagerConnect
		) {
			setTimeout(async () => {
				localStorage.removeItem(LOCAL_STORAGE_KEYS.CHOOSEN_WALLET);
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
			<Overlay style={{ zIndex: 3 }} open={isSearching} onClose={() => {}} />
			{modal === Modal.Wallet && (
				<Overlay centered open={modal === Modal.Wallet} onClose={closeModal}>
					<ConnectToWallet onConnect={closeModal} />
				</Overlay>
			)}
			{modal === Modal.Mint && (
				<Overlay open onClose={closeModal}>
					<MintNewNFT
						onMint={closeModal}
						domainName={znsDomain?.name || ''}
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
		<>
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
						onClick={() => history.push(ROUTES.MARKET)}
					/>
				</div>

				<Header
					pageWidth={pageWidth}
					znsDomain={znsDomain}
					domainMetadata={domainMetadata}
					account={account}
					openModal={openModal}
				/>

				<SideBar />

				{/* TODO: Encapsulate this */}
				<div>{children}</div>
			</div>
		</>
	);
};

export default PageContainer;
