//- React Imports
import { useState, useEffect, useRef } from 'react';
import { Spring, animated } from 'react-spring';
import { useHistory } from 'react-router-dom';

//- Web3 Imports
import { useDomainCache } from 'lib/useDomainCache';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { useEagerConnect } from 'lib/hooks/provider-hooks';

//- Library Imports
import { randomNumber } from 'lib/Random';
import useNotification from 'lib/hooks/useNotification';
import useMint from 'lib/hooks/useMint';

//- Type Imports
import { EnlistDomain } from 'types/Domain';

//- Style Imports
import styles from './ZNS.module.css';

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

import { MintNewNFT, NFTView, Enlist } from 'containers';
import { Maybe } from 'true-myth';
import { DisplayDomain, DisplayParentDomain } from 'lib/types';

type ZNSProps = {
	domain: string;
};

const ZNS: React.FC<ZNSProps> = ({ domain }) => {
	// TODO: Need to handle domains that don't exist!

	//- Browser Navigation State
	const history = useHistory();
	const backCount = useRef(0);
	const pageHistory = useRef<string[]>([]);
	const canGoBack = pageHistory.current.length > 1;
	const canGoForward = backCount.current > 0;

	const back = () => {
		pageHistory.current.pop();
		pageHistory.current.pop();
		backCount.current++;
		history.goBack();
	};

	const forward = () => {
		backCount.current--;
		history.goForward();
	};

	useEffect(() => {
		pageHistory.current = pageHistory.current.concat([domain]);
	}, [domain]);

	//- Minting State
	const { minting, minted } = useMint();

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
	const [isEnlistOverlayOpen, setIsEnlistOverlayOpen] = useState(false);
	const [isSearchActive, setIsSearchActive] = useState(false);

	//- MVP Version
	// TODO: Move the MVP version handler out to a hook
	const [mvpVersion, setMvpVersion] = useState(1);
	const mvpFilterSelect = (mvp: string) =>
		setMvpVersion(mvp === 'MVP 1' ? 1 : 3);
	const springAmount = mvpVersion === 3 ? 425.5 : 240;

	//- Web3 Wallet Data
	const walletContext = useWeb3React<Web3Provider>();
	const { account, active } = walletContext;
	const triedEagerConnect = useEagerConnect(); // This line will try auto-connect to the last wallet

	//- Web3 Domain Data
	const { useDomain } = useDomainCache();
	const domainContext = useDomain(
		domain.charAt(0) === '/' ? domain.substring(1) : domain,
	);

	useEffect(() => {
		domainContext.refetchDomain();
	}, [minted]);

	const data: Maybe<DisplayParentDomain> = domainContext.data;

	//- Data
	const [tableData, setTableData] = useState<DisplayDomain[]>([]);
	const isRoot = domain === '/' || (!data.isNothing() && !data.value.parent);

	let ownedDomain = false;
	if (!data.isNothing() && account) {
		ownedDomain = data.value.owner.id.toLowerCase() === account.toLowerCase();
	}

	// @TODO: We shouldn't need to filter out non-ipfs.io metadata URIs when we reset data
	const subdomains =
		!data.isNothing() && data.value.subdomains
			? data.value.subdomains.filter(
					(d: any) => d.metadata && d.metadata.indexOf('ipfs.io') > -1,
			  )
			: [];

	//- Enlist Overlay
	// TODO: Really need to make overlays more reusable - this isn't an ideal way to handle overlays with data
	const [enlisting, setEnlisting] = useState<EnlistDomain>({
		id: '',
		domainName: '',
		minter: '',
		image: '',
	});
	const enlistCurrentDomain = async () => {
		if (data.isNothing()) return;

		const open = () => {
			openEnlistOverlay(
				data.value.id,
				domain.substring(1),
				data.value.minter.id,
				data.value.image || '',
			);
		};

		if (!data.value.image) {
			const response: Response = await fetch(data.value.metadata);
			const body = await response.json();
			data.value.image = body.image;
			open();
		} else {
			open();
		}
	};
	const openEnlistOverlay = (
		domainId: string,
		domainName: string,
		minter: string,
		image: string,
	) => {
		setEnlisting({
			id: domainId,
			domainName: domainName,
			minter: minter,
			image: image,
		});
		setIsEnlistOverlayOpen(true);
	};
	const onEnlistSubmit = () => {
		addNotification(`Enlisted to purchase ${enlisting.domainName}!`);
		setIsEnlistOverlayOpen(false);
	};

	useEffect(() => {
		if (triedEagerConnect)
			addNotification(active ? 'Wallet connected!' : 'Wallet disconnected!');
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [active]);

	//- Effects
	useEffect(() => {
		// TODO: Clean this whole hook up
		if (data.isNothing()) setTableData([]);
		else {
			// Set the domain data for table view
			setTableData(subdomains);

			// Get the data for Preview Card
			//- Note:
			// We're checking subdomains here, because we want to defer the IPFS
			// call to NFT View to prevent unneeded IPFS calls
			if (
				!data.isNothing() &&
				data.value.subdomains.length > 0 &&
				data.value.metadata
			) {
				// TODO: Maybe move this method into lib/ipfs-client.ts since we use it in a couple places
				// TODO: Worth deferring all the metadata loading to the domain table component?
				fetch(data.value.metadata).then(async (d: Response) => {
					const nftData = await d.json();
					data.value.image = nftData.image;
					data.value.name = nftData.title;
					data.value.description = nftData.description;
					setIsLoading(false);
				});
			}
			setHasLoaded(true);
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [data, hasLoaded]);

	useEffect(() => {
		setTableData([]);
		setIsNftView(false);
		setIsLoading(true);
	}, [domain]);

	return (
		<>
			{/* Overlays */}
			<NotificationDrawer />
			<Overlay open={isSearchActive} onClose={() => {}}>
				<></>
			</Overlay>
			<Overlay
				centered
				open={isWalletOverlayOpen}
				onClose={() => setIsWalletOverlayOpen(false)}
			>
				<ConnectToWallet onConnect={() => setIsWalletOverlayOpen(false)} />
			</Overlay>
			<Overlay
				open={isMintOverlayOpen}
				onClose={() => setIsMintOverlayOpen(false)}
			>
				<MintNewNFT
					onMint={() => setIsMintOverlayOpen(false)}
					domainName={domain}
					domainId={!data.isNothing() ? data.value.id : ''}
				/>
			</Overlay>
			<Overlay
				centered
				open={isProfileOverlayOpen}
				onClose={() => setIsProfileOverlayOpen(false)}
			>
				<Profile yours id={account ? account : ''} />
			</Overlay>
			<Overlay
				open={isEnlistOverlayOpen}
				onClose={() => setIsEnlistOverlayOpen(false)}
			>
				<Enlist
					onSubmit={onEnlistSubmit}
					domainId={enlisting.id}
					domainName={enlisting.domainName}
					minterName={enlisting.minter}
					image={enlisting.image}
				/>
			</Overlay>

			{/* ZNS Content */}
			<div
				className="page-spacing"
				style={{
					opacity: hasLoaded ? 1 : 0,
					transition: 'opacity 0.2s ease-in-out',
					paddingTop: mvpVersion === 1 ? 155 : 139,
				}}
			>
				{/* TODO: Maybe worth moving sidebar up to App.tsx depending on its functionality */}
				{mvpVersion === 3 && <SideBar />}

				{/* Nav Bar */}
				{/* TODO: Make a more generic Nav component and nest FilterBar and TitleBar */}
				<FilterBar
					style={
						isSearchActive
							? { zIndex: isSearchActive ? 10000 : 10, background: 'none' }
							: {}
					}
					onSelect={mvpFilterSelect}
					filters={!isSearchActive ? ['MVP 1', 'MVP 3'] : []}
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
										glow={ownedDomain}
										onClick={
											() => {
												ownedDomain
													? setIsMintOverlayOpen(true)
													: alert('You can only mint NFTs on domains you own');
											}

											// isRoot || ownedDomain
											//   ? setIsMintOverlayOpen(true)
											//   : alert("You can only mint NFTs on domains you own")
										}
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
										iconUri={`https://picsum.photos/seed/${account}/200/300`}
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
									image={!data.isNothing() ? data.value.image || '' : ''}
									name={!data.isNothing() ? data.value.name : ''}
									domain={domain}
									description={
										!data.isNothing() ? data.value.description || '' : ''
									}
									creatorId={
										!data.isNothing() &&
										data.value.minter &&
										data.value.minter.id
											? data.value.minter.id
											: ''
									}
									ownerId={!data.isNothing() ? data.value.owner.id : ''}
									isLoading={isLoading}
									mvpVersion={mvpVersion}
									onButtonClick={enlistCurrentDomain}
									onImageClick={() => setIsNftView(true)}
								>
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
									empty={!data.isNothing() && subdomains.length === 0}
									mvpVersion={mvpVersion}
									onEnlist={openEnlistOverlay}
									isGridView={isGridView}
									setIsGridView={setIsGridView}
								/>
							</animated.div>
						)}
					</Spring>
				)}

				{!data.isNothing() && (isNftView || subdomains.length === 0) && (
					<Spring from={{ opacity: 0 }} to={{ opacity: 1 }}>
						{(styles) => (
							<animated.div style={styles}>
								<NFTView domain={domain} onEnlist={enlistCurrentDomain} />
							</animated.div>
						)}
					</Spring>
				)}
			</div>
		</>
	);
};

export default ZNS;
