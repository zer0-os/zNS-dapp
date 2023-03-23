//- React Imports
import React, { useMemo } from 'react';
import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';

//- Style Imports
import styles from './ZNS.module.scss';

//- Components & Containers
import { NFTViewModalProvider } from 'containers/other/NFTView/providers/NFTViewModalProvider/NFTViewModalProvider';
import { SubdomainTable, CurrentDomainPreview, Raffle } from 'containers';
import { Stage } from 'containers/flows/MintDropNFT/types';

//- Library Imports
import { NFTView, TransferOwnership } from 'containers';
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';
import { useDidMount } from 'lib/hooks/useDidMount';
import { useNavbar } from 'lib/hooks/useNavbar';

type ZNSProps = {
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

const ZNS: React.FC<ZNSProps> = () => {
	// TODO: Need to handle domains that don't exist!

	///////////////////
	// Web3 Handling //
	///////////////////

	//- Domain Data
	const { domain: znsDomain, domainRaw: domain } = useCurrentDomain();

	const enableBanner = true;

	const location = useLocation();
	const nftView = useMemo(
		() => location.search.includes('view=true'),
		[location.search],
	);

	//- Page State
	const [hasLoaded, setHasLoaded] = useState(false);
	const [showDomainTable, setShowDomainTable] = useState(true);
	const [isNftView, setIsNftView] = useState(nftView === true);

	//- Overlay State
	const [modal, setModal] = useState<Modal | undefined>();

	//- Claim Drop Stage state
	const [claimDropStage, setClaimDropStage] = useState<Stage>();

	///////////
	// Hooks //
	///////////

	const { setNavbarTitle } = useNavbar();

	useDidMount(() => {
		setNavbarTitle(undefined);
	});

	///////////////
	// Functions //
	///////////////

	const scrollToTop = () => {
		document.querySelector('body')?.scrollTo(0, 0);
	};

	/////////////////////
	// Overlay Toggles //
	/////////////////////
	const closeModal = () => {
		setModal(undefined);
	};

	const openTransferOwnershipModal = () => {
		setModal(Modal.Transfer);
	};

	/////////////
	// Effects //
	/////////////

	/* WIP */
	useEffect(() => {
		scrollToTop();
		setShowDomainTable(!isNftView);
	}, [isNftView]);

	/* Also WIP */
	useEffect(() => {
		setIsNftView(nftView === true);
	}, [nftView]);

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
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [znsDomain, hasLoaded]);

	/////////////////////
	// React Fragments //
	/////////////////////

	const previewCard = () => {
		const isVisible = domain !== '' && !isNftView;

		return isVisible ? <CurrentDomainPreview /> : <></>;
	};

	////////////
	// Render //
	////////////

	return (
		<>
			{/* TODO: Convert page width into a hook to add condition here */}
			{modal === Modal.Transfer && (
				<TransferOwnership
					metadataUrl={znsDomain?.metadata ?? ''}
					domainName={znsDomain?.name ?? ''}
					domainId={znsDomain?.id ?? ''}
					onTransfer={closeModal}
					creatorId={znsDomain?.minter?.id || ''}
					ownerId={znsDomain?.owner?.id || ''}
				/>
			)}
			{/* ZNS Content */}
			{enableBanner && <Raffle setClaimDropStage={setClaimDropStage} />}
			{!isNftView && (
				<div className="main">
					{previewCard()}
					{showDomainTable && (
						<div className={styles.TableContainer}>
							<SubdomainTable />
						</div>
					)}
				</div>
			)}
			{znsDomain && isNftView && (
				<NFTViewModalProvider>
					<NFTView
						// domain={domain}
						onTransfer={openTransferOwnershipModal}
						claimDropStage={claimDropStage}
						setClaimDropStage={setClaimDropStage}
					/>
				</NFTViewModalProvider>
			)}
		</>
	);
};

export default ZNS;
