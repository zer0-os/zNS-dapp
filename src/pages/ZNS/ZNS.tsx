/* eslint-disable react-hooks/exhaustive-deps */
//- React Imports
import React from 'react';
import { useState, useEffect, useRef } from 'react';
import { Spring, animated } from 'react-spring';
import { useHistory } from 'react-router-dom';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { useEagerConnect } from 'lib/hooks/provider-hooks';

//- Library Imports
import { useChainSelector } from 'lib/providers/ChainSelectorProvider';
import { randomNumber } from 'lib/Random';
import useNotification from 'lib/hooks/useNotification';
import { useMintProvider } from 'lib/providers/MintProvider';
import useEnlist from 'lib/hooks/useEnlist';
import { getMetadata } from 'lib/metadata';
import useMvpVersion from 'lib/hooks/useMvpVersion';

//- Type Imports
import { Metadata, DisplayDomain, NftParams, Domain } from 'lib/types';

//- Style Imports
import styles from './ZNS.module.css';

//- Icon Imports
import userIcon from 'assets/user.svg';

//- Components & Containers
import {
	AssetGraphCard,
	AssetMarketCapCard,
	AssetPriceCard,
	ConnectToWallet,
	FutureButton,
	FilterBar,
	HorizontalScroll,
	DomainTable,
	TitleBar,
	Tooltip,
	NextDrop,
	IconButton,
	Overlay,
	Profile,
	PreviewCard,
	SideBar,
	NotificationDrawer,
	NumberButton,
	MintPreview,
	TransferPreview,
	Spinner,
} from 'components';

//- Library Imports
import { useTransferProvider } from 'lib/providers/TransferProvider';
import { MintNewNFT, NFTView, MakeABid, TransferOwnership } from 'containers';
import { getDomainId } from 'lib/utils';
import { useZnsDomain } from 'lib/hooks/useZnsDomain';

type ZNSProps = {
	domain: string;
	version?: number;
	isNftView?: boolean;
};

enum Modal {
	Bid,
	Mint,
	Profile,
	Transfer,
	Wallet,
}

// @TODO: Rewrite this whole page

const ZNS: React.FC<ZNSProps> = ({ domain, version, isNftView: nftView }) => {
	// TODO: Need to handle domains that don't exist!

	const { mvpVersion } = useMvpVersion();

	///////////////////
	// Web3 Handling //
	///////////////////

	//- Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { account, active, chainId } = walletContext;
	const triedEagerConnect = useEagerConnect(); // This line will try auto-connect to the last wallet only if the user hasnt disconnected

	//- Chain Selection (@todo: refactor to provider)
	const chainSelector = useChainSelector();
	React.useEffect(() => {
		if (chainId && chainSelector.selectedChain !== chainId) {
			chainSelector.selectChain(chainId);
		}
	}, [chainId]);

	//- Domain Data
	const domainId = getDomainId(domain.substring(1));
	const znsDomain = useZnsDomain(domainId);
	const loading = znsDomain.loading;

	////////////////////////
	// Browser Navigation //
	////////////////////////

	//- Browser Navigation State
	const history = useHistory();
	const backCount = useRef(0);
	const pageHistory = useRef<string[]>([]);
	const [forwardDomain, setForwardDomain] = useState<string | undefined>();
	const lastDomain = useRef<string>();
	const canGoBack = pageHistory.current.length > 1;
	const canGoForward = !!forwardDomain;

	// Force to go back to home if invalid domain
	React.useEffect(() => {
		if (!loading) {
			if (!znsDomain.domain) {
				console.log(`invalid domain, returning to home`);
				history.push('/');
				return;
			}
		}
	}, [znsDomain.domain, loading]);

	//- Minting State
	const { minting, minted } = useMintProvider();
	const { transferring, transferred } = useTransferProvider();

	//- Notification State
	const { addNotification } = useNotification();

	//- Page State
	const [hasLoaded, setHasLoaded] = useState(false);
	const [showDomainTable, setShowDomainTable] = useState(true);
	const [isNftView, setIsNftView] = useState(nftView === true);

	//- Table State
	const [isGridView, setIsGridView] = useState(false);

	//- Overlay State
	const [modal, setModal] = useState<Modal | undefined>();
	const [isSearchActive, setIsSearchActive] = useState(false);
	const [isTransferModalOpen, setIsTransferModalOpen] = useState(false); // @todo refactor out?

	//- MVP Version
	// TODO: Move the MVP version handler out to a hook
	const springAmount = mvpVersion === 3 ? 425.5 : 240;

	//- Data
	const [tableData, setTableData] = useState<DisplayDomain[]>([]);
	const isRoot: boolean =
		domain === '/' || (znsDomain.domain ? !znsDomain.domain.parent : false);
	const isOwnedByUser: boolean =
		znsDomain?.domain?.owner?.id.toLowerCase() === account?.toLowerCase();

	///////////////
	// Functions //
	///////////////

	// Go back through page history
	const back = () => {
		pageHistory.current.pop();
		pageHistory.current.pop();
		backCount.current++;
		history.goBack();
	};

	// Go forward through page history
	const forward = () => {
		if (forwardDomain) history.push(forwardDomain);
		setForwardDomain(undefined);
	};

	/////////////////////
	// Overlay Toggles //
	/////////////////////

	const closeModal = () => {
		setModal(undefined);
	};
	const openMint = () => setModal(Modal.Mint);
	const openProfile = () => setModal(Modal.Profile);
	const openWallet = () => {
		setModal(Modal.Wallet);
	};
	const openBidOverlay = () => {
		if (!znsDomain.domain) return;
		setModal(Modal.Bid);
	};

	const navigate = (to: string) => {
		history.push(to);
		// @todo rewrite
		if (modal) closeModal();
	};

	/////////////
	// Effects //
	/////////////

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
		pageHistory.current = pageHistory.current.concat([domain]);
	}, [domain]);

	/* WIP */
	useEffect(() => {
		setShowDomainTable(!isNftView);
	}, [isNftView]);

	/* Also WIP */
	useEffect(() => {
		setIsNftView(nftView === true);
	}, [nftView]);

	/* Find the freshly minted NFT */
	useEffect(() => {
		console.log(minted);
		if (minted.length === 0) {
			return;
		}

		znsDomain.refetch();

		// try {
		// 	const d = minted[minted.length - 1] as NftParams;
		// 	const newDomain = `${d.zna === '/' ? d.zna : d.zna + '.'}${d.domain}`;
		// 	// Temporarily disabled
		// 	// history.push(newDomain);
		// } catch (e) {
		// 	console.error('Failed to find newly minted zNA');
		// }
	}, [minted]);

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
	}, [active]);

	useEffect(() => {
		// TODO: Clean this whole hook up
		if (!znsDomain.domain) setTableData([]);
		else {
			// Set the domain data for table view
			setIsNftView(nftView === true || tableData?.length === 0);
			setTableData(znsDomain.domain.subdomains);
			setHasLoaded(true);
		}
	}, [znsDomain.domain, hasLoaded]);

	/////////////////////
	// React Fragments //
	/////////////////////

	const previewCard = () => (
		<>
			{/* Preview Card */}
			{/* TODO: This definitely needs some refactoring */}
			<Spring
				from={{ opacity: 0, marginTop: -springAmount }}
				to={
					!isRoot && (znsDomain.loading || tableData.length >= 0) && !isNftView
						? { opacity: 1, marginTop: 0 }
						: { opacity: 0, marginTop: -springAmount }
				}
			>
				{(styles) => (
					<animated.div style={styles}>
						<PreviewCard
							domain={domain}
							metadataUrl={znsDomain?.domain?.metadata}
							creatorId={znsDomain?.domain?.minter?.id || ''}
							disabled={
								znsDomain.domain?.owner?.id.toLowerCase() ===
									account?.toLowerCase() || !active
							}
							ownerId={znsDomain?.domain?.owner?.id || ''}
							mvpVersion={mvpVersion}
							onButtonClick={openBidOverlay}
							onImageClick={() => {}}
						>
							{mvpVersion === 3 && (
								<HorizontalScroll fade>
									<AssetPriceCard
										title={`${domain.substring(1, 5).toUpperCase()} Price`}
										price={randomNumber(85, 400, 2)}
										change={randomNumber(-30, 30, 2)}
									/>
									<AssetGraphCard
										title={`Price ${domain.substring(1, 5).toUpperCase()}`}
									/>
									<AssetPriceCard
										title={`${domain.substring(1, 5).toUpperCase()} Price`}
										price={randomNumber(85, 400, 2)}
										change={randomNumber(-30, 30, 2)}
									/>
									<AssetMarketCapCard
										title={`Total ${domain
											.substring(1, 5)
											.toUpperCase()} Holders`}
										price={randomNumber(15000, 40000, 2)}
									/>
									<AssetMarketCapCard
										title={`Total ${domain
											.substring(1, 5)
											.toUpperCase()} Holders`}
										price={randomNumber(15000, 40000, 2)}
									/>
									<AssetMarketCapCard
										title={`Total ${domain
											.substring(1, 5)
											.toUpperCase()} Holders`}
										price={randomNumber(15000, 40000, 2)}
									/>
								</HorizontalScroll>
							)}
						</PreviewCard>
					</animated.div>
				)}
			</Spring>
		</>
	);

	const subdomainTable = () => (
		<>
			{/* Subdomain Table */}
			{showDomainTable && (
				<DomainTable
					domains={tableData.slice().sort((a, b) => (a.name < b.name ? -1 : 1))}
					isRootDomain={isRoot}
					style={{ marginTop: 16 }}
					empty={(znsDomain.domain && tableData.length === 0) as boolean}
					disableButton={!active}
					isGridView={isGridView}
					setIsGridView={setIsGridView}
					userId={account as string}
					onRowClick={(domain: Domain) =>
						navigate(domain.name.split('wilder.')[1])
					}
				/>
			)}
		</>
	);

	const modals = () => (
		<>
			{/* Overlays */}
			<NotificationDrawer />
			{znsDomain.domain && (
				<Overlay onClose={closeModal} centered open={modal === Modal.Bid}>
					<MakeABid domain={znsDomain.domain} onBid={closeModal} />
				</Overlay>
			)}
			<Overlay style={{ zIndex: 0 }} open={isSearchActive} onClose={() => {}}>
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
						domainId={znsDomain.domain ? znsDomain.domain.id : ''}
						domainOwner={znsDomain.domain ? znsDomain.domain.owner.id : ''}
						subdomains={
							(znsDomain.domain?.subdomains?.map(
								(sub: any) => sub.name,
							) as string[]) || []
						}
					/>
				</Overlay>
			)}
			{modal === Modal.Profile && (
				<Overlay fullScreen centered open onClose={closeModal}>
					<Profile yours id={account ? account : ''} onNavigate={navigate} />
				</Overlay>
			)}
			{modal === Modal.Transfer && (
				<TransferOwnership
					metadataUrl={znsDomain.domain?.metadata ?? ''}
					domainName={domain}
					domainId={znsDomain.domain?.id ?? ''}
					onModalChange={(value) => setIsTransferModalOpen(value)}
					creatorId={
						znsDomain.domain && znsDomain.domain.minter.id
							? znsDomain.domain.minter.id
							: ''
					}
					ownerId={
						znsDomain.domain && znsDomain.domain.owner.id
							? znsDomain.domain.owner.id
							: ''
					}
				/>
			)}
		</>
	);

	////////////
	// Render //
	////////////

	return (
		<>
			{modals()}
			{/* ZNS Content */}
			<div
				className="page-spacing"
				style={{
					opacity: hasLoaded ? 1 : 0,
					transition: 'opacity 0.2s ease-in-out',
					paddingTop: mvpVersion === 1 ? 155 : 139,
				}}
			>
				{/* Nav Bar */}
				{/* TODO: Make a more generic Nav component and nest FilterBar and TitleBar */}
				<FilterBar
					style={
						isSearchActive
							? { zIndex: isSearchActive ? 10000 : 10, background: 'none' }
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
						<div>
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
									Connect Wallet
								</FutureButton>
							)}
							{account && !isSearchActive && (
								<>
									{/* Mint button */}
									<FutureButton
										glow={account != null}
										onClick={() => {
											account != null
												? openMint()
												: addNotification('Please connect your wallet.');
										}}
										loading={loading}
									>
										{isOwnedByUser === true && 'MINT NFT'}
										{isOwnedByUser === false && 'REQUEST TO MINT NFT'}
									</FutureButton>

									{/* Mint Progress button */}
									{(minting.length > 0 || minted.length > 0) && (
										<Tooltip content={<MintPreview />}>
											<NumberButton
												rotating={minting.length > 0}
												number={minting.length}
												onClick={() => {}}
											/>
										</Tooltip>
									)}

									{/* Transfer Progress button */}
									{transferring.length > 0 && (
										<Tooltip content={<TransferPreview />}>
											<NumberButton
												rotating={transferring.length > 0}
												number={transferring.length}
												onClick={() => {}}
											/>
										</Tooltip>
									)}

									{/* Profile Button */}
									<IconButton
										onClick={openProfile}
										style={{ height: 32, width: 32, borderRadius: '50%' }}
										iconUri={
											mvpVersion === 3
												? `https://picsum.photos/seed/${account}/200/300`
												: userIcon
										}
									/>

									{/* TODO: Change the triple dot button to a component */}
									<div className={styles.Dots} onClick={openWallet}>
										<div></div>
										<div></div>
										<div></div>
									</div>
								</>
							)}
						</div>
					</TitleBar>
				</FilterBar>

				{/* TODO: Maybe worth moving sidebar up to App.tsx depending on its functionality */}
				{mvpVersion === 3 && <SideBar />}

				{/* Asset Cards per MVP 3 */}
				{mvpVersion === 3 && (
					<Spring
						from={{ opacity: 0, marginTop: -231 }}
						to={{ opacity: isRoot ? 1 : 0, marginTop: isRoot ? 0 : -231 }}
					>
						{(styles) => (
							<animated.div style={styles}>
								<NextDrop
									title="Futopia"
									artist="Frank Wilder"
									date={new Date(new Date().getTime() + 24 * 60 * 60 * 1000)}
									style={{ marginTop: 16 }}
								/>
								<HorizontalScroll style={{ marginTop: 16 }} fade>
									<AssetPriceCard
										title={`${domain.substring(1, 5).toUpperCase()} Price`}
										price={randomNumber(85, 400, 2)}
										change={randomNumber(-30, 30, 2)}
									/>
									<AssetGraphCard
										title={`Price ${domain.substring(1, 5).toUpperCase()}`}
									/>
									<AssetPriceCard
										title={`${domain.substring(1, 5).toUpperCase()} Price`}
										price={randomNumber(85, 400, 2)}
										change={randomNumber(-30, 30, 2)}
									/>
									<AssetMarketCapCard
										title={`Total ${domain
											.substring(1, 5)
											.toUpperCase()} Holders`}
										price={randomNumber(15000, 40000, 2)}
									/>
									<AssetMarketCapCard
										title={`Total ${domain
											.substring(1, 5)
											.toUpperCase()} Holders`}
										price={randomNumber(15000, 40000, 2)}
									/>
									<AssetMarketCapCard
										title={`Total ${domain
											.substring(1, 5)
											.toUpperCase()} Holders`}
										price={randomNumber(15000, 40000, 2)}
									/>
								</HorizontalScroll>
							</animated.div>
						)}
					</Spring>
				)}

				{previewCard()}
				{subdomainTable()}

				{znsDomain.domain && (isNftView || tableData.length === 0) && (
					<Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
						{(styles) => (
							<animated.div style={styles}>
								<NFTView
									domain={domain}
									onTransfer={() => setIsTransferModalOpen(true)}
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
