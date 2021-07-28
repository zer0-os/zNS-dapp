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
import { Metadata, DisplayDomain, DisplayParentDomain } from 'lib/types';

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
} from 'components';

import { MintNewNFT, NFTView, MakeABid } from 'containers';
import { getDomainId } from 'lib/utils';
import { useZnsDomain } from 'lib/hooks/useZnsDomain';

type ZNSProps = {
	domain: string;
	version?: number;
};

const ZNS: React.FC<ZNSProps> = ({ domain, version }) => {
	// TODO: Need to handle domains that don't exist!

	const { mvpVersion } = useMvpVersion();

	///////////////////
	// Web3 Handling //
	///////////////////

	//- Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { account, active, chainId } = walletContext;
	const triedEagerConnect = useEagerConnect(); // This line will try auto-connect to the last wallet

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

	const [previewMetadata, setPreviewMetadata] = useState<Metadata | undefined>(
		undefined,
	);

	////////////////////////
	// Browser Navigation //
	////////////////////////

	//- Browser Navigation State
	const history = useHistory();
	const backCount = useRef(0);
	const pageHistory = useRef<string[]>([]);
	const canGoBack = pageHistory.current.length > 1;
	const canGoForward = backCount.current > 0;

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
	const { enlisting, enlist, clear } = useEnlist();

	//- Notification State
	const { addNotification } = useNotification();

	//- Page State
	const [isLoading, setIsLoading] = useState(true);
	const [hasLoaded, setHasLoaded] = useState(false);
	const [isNftView, setIsNftView] = useState(false);

	//- Table State
	const [isGridView, setIsGridView] = useState(false);

	//- Overlay State
	const [isWalletOverlayOpen, setIsWalletOverlayOpen] = useState(false);
	const [isMintOverlayOpen, setIsMintOverlayOpen] = useState(false);
	const [isProfileOverlayOpen, setIsProfileOverlayOpen] = useState(false);
	const [isSearchActive, setIsSearchActive] = useState(false);
	const [isBidOverlayOpen, setIsBidOverlayOpen] = useState(false);

	//- MVP Version
	// TODO: Move the MVP version handler out to a hook
	const springAmount = mvpVersion === 3 ? 425.5 : 240;

	//- Data
	const [tableData, setTableData] = useState<DisplayDomain[]>([]);
	const isRoot: boolean =
		domain === '/' || (znsDomain.domain ? !znsDomain.domain.parent : false);

	// @TODO: We shouldn't need to filter out non-ipfs.io metadata URIs when we reset data
	const subdomains =
		znsDomain.domain && znsDomain.domain.subdomains
			? znsDomain.domain.subdomains.filter(
					(d: any) => d.metadata && d.metadata.indexOf('ipfs.io') > -1,
			  )
			: [];

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
		backCount.current--;
		history.goForward();
	};

	const openBidOverlay = () => {
		if (!znsDomain.domain) return;
		setIsBidOverlayOpen(true);
	};
	const closeBidOverlay = () => setIsBidOverlayOpen(false);

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		pageHistory.current = pageHistory.current.concat([domain]);
	}, [domain]);

	// useEffect(() => {
	// 	domainContext.refetchDomain();
	// 	// eslint-disable-next-line react-hooks/exhaustive-deps
	// }, [minted]);

	useEffect(() => {
		if (triedEagerConnect)
			addNotification(active ? 'Wallet connected.' : 'Wallet disconnected.');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [active]);

	//- Effects
	useEffect(() => {
		// TODO: Clean this whole hook up
		if (!znsDomain.domain) setTableData([]);
		else {
			// Set the domain data for table view
			setTableData(subdomains);

			const shouldGetMetadata =
				znsDomain.domain &&
				znsDomain.domain.subdomains.length > 0 &&
				znsDomain.domain.metadata;

			//- Note:
			// We're checking subdomains here, because we want to defer the IPFS
			// call to NFT View to prevent unneeded IPFS calls
			// Get the data for Preview Card
			if (shouldGetMetadata) {
				getMetadata(znsDomain.domain.metadata).then((d) => {
					if (!d) return;
					setPreviewMetadata(d);
					setIsLoading(false);
				});
			}

			setHasLoaded(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [znsDomain.domain, hasLoaded]);

	useEffect(() => {
		setTableData([]);
		setIsNftView(false);
		setIsLoading(true);
	}, [domain]);

	////////////
	// RENDER //
	////////////

	return (
		<>
			{/* Overlays */}
			<NotificationDrawer />
			{znsDomain.domain && (
				<Overlay onClose={closeBidOverlay} centered open={isBidOverlayOpen}>
					<MakeABid domain={znsDomain.domain} onBid={closeBidOverlay} />
				</Overlay>
			)}
			<Overlay style={{ zIndex: 0 }} open={isSearchActive} onClose={() => {}}>
				<></>
			</Overlay>
			{isWalletOverlayOpen && (
				<Overlay
					centered
					open={isWalletOverlayOpen}
					onClose={() => setIsWalletOverlayOpen(false)}
				>
					<ConnectToWallet onConnect={() => setIsWalletOverlayOpen(false)} />
				</Overlay>
			)}
			{isMintOverlayOpen && (
				<Overlay open onClose={() => setIsMintOverlayOpen(false)}>
					<MintNewNFT
						onMint={() => setIsMintOverlayOpen(false)}
						domainName={domain}
						domainId={znsDomain.domain ? znsDomain.domain.id : ''}
						domainOwner={znsDomain.domain ? znsDomain.domain.owner.id : ''}
					/>
				</Overlay>
			)}
			{isProfileOverlayOpen && (
				<Overlay
					fullScreen
					centered
					open
					onClose={() => setIsProfileOverlayOpen(false)}
				>
					<Profile yours id={account ? account : ''} />
				</Overlay>
			)}

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
							{!active && (
								<FutureButton glow onClick={() => setIsWalletOverlayOpen(true)}>
									Connect To Wallet
								</FutureButton>
							)}
							{active && !isSearchActive && (
								<>
									{/* Mint button */}
									<FutureButton
										glow={account != null}
										onClick={() => {
											account != null
												? setIsMintOverlayOpen(true)
												: addNotification('Please connect your wallet.');
										}}
									>
										Mint New NFT
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

									{/* Profile Button */}
									<IconButton
										onClick={() => setIsProfileOverlayOpen(true)}
										style={{ height: 32, width: 32, borderRadius: '50%' }}
										iconUri={
											mvpVersion === 3
												? `https://picsum.photos/seed/${account}/200/300`
												: userIcon
										}
									/>

									{/* TODO: Change the triple dot button to a component */}
									<div
										className={styles.Dots}
										onClick={() => setIsWalletOverlayOpen(true)}
									>
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

				{/* Preview Card */}
				{/* TODO: This definitely needs some refactoring */}
				{subdomains.length >= 0 && !isNftView && (
					<Spring
						from={{ opacity: 0, marginTop: -springAmount }}
						to={{
							opacity: !isRoot && hasLoaded && subdomains.length ? 1 : 0,
							marginTop:
								!isRoot && hasLoaded && subdomains.length ? 0 : -springAmount,
						}}
					>
						{(styles) => (
							<animated.div style={styles}>
								<PreviewCard
									image={previewMetadata?.image || ''}
									name={previewMetadata?.title || ''}
									domain={domain}
									description={previewMetadata?.description || ''}
									creatorId={
										znsDomain.domain &&
										znsDomain.domain.minter &&
										znsDomain.domain.minter.id
											? znsDomain.domain.minter.id
											: ''
									}
									disabled={
										znsDomain.domain?.owner?.id.toLowerCase() ===
										account?.toLowerCase()
									}
									ownerId={znsDomain.domain ? znsDomain.domain.owner.id : ''}
									isLoading={isLoading}
									mvpVersion={mvpVersion}
									onButtonClick={openBidOverlay}
									onImageClick={() => setIsNftView(true)}
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
				)}

				{/* Subdomain table */}

				{/* Subdomain Table */}
				{subdomains.length > 0 && !isNftView && (
					<Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
						{(styles) => (
							<animated.div style={styles}>
								<DomainTable
									domains={tableData}
									isRootDomain={isRoot}
									style={{ marginTop: 16 }}
									empty={
										(znsDomain.domain && subdomains.length === 0) as boolean
									}
									isGridView={isGridView}
									setIsGridView={setIsGridView}
									userId={account as string}
								/>
							</animated.div>
						)}
					</Spring>
				)}

				{znsDomain.domain && (isNftView || subdomains.length === 0) && (
					<Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
						{(styles) => (
							<animated.div style={styles}>
								<NFTView domain={domain} />
							</animated.div>
						)}
					</Spring>
				)}
			</div>
		</>
	);
};

export default ZNS;
