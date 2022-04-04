//- React Imports
import React, { useCallback, useMemo, useState } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core'; // Wallet data
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'; // Wallet data

//- Component Imports
import { Overlay } from 'components';
import MakeABid from 'containers/flows/MakeABid/MakeABid';
import {
	Actions,
	NFT,
	Stats,
	TokenHashBoxes,
	Attributes,
	History,
	DomainSettings,
} from './elements';

//- Library Imports
import useCurrency from 'lib/hooks/useCurrency';
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';

import { useNftData } from './hooks';

//- Type Imports
import { Option } from 'components/Dropdowns/OptionDropdown/OptionDropdown';

//- Constants Imports
import { NFT_MORE_ACTIONS_TITLE, NFT_MORE_ACTIONS } from './NFTView.constants';

//- Style Imports
import styles from './NFTView.module.scss';

//- Componennt level type definitions
type NFTViewProps = {
	onTransfer: () => void;
};

const NFTView: React.FC<NFTViewProps> = ({ onTransfer }) => {
	//- Page State
	const [isBidOverlayOpen, setIsBidOverlayOpen] = useState(false);
	const [isDomainSettingsOpen, setIsDomainSettingsOpen] =
		useState<Boolean>(false);

	//- Web3 Wallet Data
	const { account, active, chainId } = useWeb3React<Web3Provider>();

	//- Current Domain Data
	const { domainId, domain: znsDomain, domainMetadata } = useCurrentDomain();

	//- Wild Currency Price
	const { wildPriceUsd } = useCurrency();

	//- NFT Hook Data
	const {
		isHistoryLoading,
		history,
		bids,
		highestBid,
		buyNowPrice,
		yourBid,
		getHistory,
		getPriceData,
		downloadAsset,
		shareAsset,
		refetch,
	} = useNftData();

	//- Memoized data
	const { isBiddable, isOwnedByYou, assetUrl, nftMoreOptions } = useMemo(() => {
		const isRootDomain = (znsDomain?.name || '').split('.').length <= 2;
		const isOwnedByYou =
			znsDomain?.owner.id.toLowerCase() === account?.toLowerCase();
		const isBiddable =
			(isRootDomain && !isOwnedByYou) || Boolean(domainMetadata?.isBiddable);
		const assetUrl =
			znsDomain?.animation_url || znsDomain?.image_full || znsDomain?.image;
		const nftMoreOptions = isOwnedByYou ? NFT_MORE_ACTIONS.slice(0, 2) : [];

		return { isBiddable, isOwnedByYou, assetUrl, nftMoreOptions };
	}, [znsDomain, domainMetadata, account]);

	///////////////
	// Functions //
	///////////////

	//- Callback functions
	const onOpenBidOverlay = useCallback(() => {
		if (!znsDomain || isOwnedByYou || !active) {
			return;
		}

		setIsBidOverlayOpen(true);
	}, [znsDomain, active, isOwnedByYou]);

	// Close Make A Bid
	const onCloseBidOverlay = () => setIsBidOverlayOpen(false);
	// Close Domain Settings
	const onCloseDomainSettingsOverlay = () => setIsDomainSettingsOpen(false);
	const onBid = useCallback(async () => {
		getPriceData();
		getHistory();
		onCloseBidOverlay();
	}, [getHistory, getPriceData]);

	// Dropdown Option Select
	const onSelectNFTMoreOption = (option: Option) => {
		if (option.title === NFT_MORE_ACTIONS_TITLE.MY_DOMAIN_SETTINGS) {
			setIsDomainSettingsOpen(true);
		} else if (option.title === NFT_MORE_ACTIONS_TITLE.TRANSFER_OWNERSHIP) {
			onTransfer();
		}
	};

	////////////
	// Render //
	////////////

	return (
		<div className={styles.NFTView}>
			<NFT
				title={domainMetadata?.title as string}
				owner={znsDomain?.owner.id as string}
				creator={znsDomain?.minter.id as string}
				onDownload={downloadAsset}
				onShare={shareAsset}
				assetUrl={assetUrl as string}
				description={znsDomain?.description as string}
				options={nftMoreOptions}
				onSelectOption={onSelectNFTMoreOption}
			/>

			<Actions
				domainId={znsDomain?.id}
				highestBid={highestBid}
				buyNowPrice={buyNowPrice}
				yourBid={yourBid}
				onMakeBid={onOpenBidOverlay}
				isOwnedByUser={isOwnedByYou}
				wildPriceUsd={wildPriceUsd}
				refetch={refetch}
				isBiddable={isBiddable}
			/>

			<Stats
				znsDomain={znsDomain}
				wildPriceUsd={wildPriceUsd}
				bids={bids}
				isLoading={isHistoryLoading}
			/>

			<Attributes znsDomain={znsDomain} />

			<TokenHashBoxes
				domainId={domainId}
				chainId={chainId}
				znsDomain={znsDomain}
			/>

			<History isLoading={isHistoryLoading} history={history} />

			{/* Make a Bid Modal */}
			{isBidOverlayOpen && (
				<Overlay onClose={onCloseBidOverlay} open={isBidOverlayOpen}>
					<MakeABid
						domain={znsDomain!}
						onBid={onBid}
						onClose={onCloseBidOverlay}
					/>
				</Overlay>
			)}

			{/* Domain Settings Modal */}
			{isDomainSettingsOpen && (
				<DomainSettings
					domainId={domainId}
					onClose={onCloseDomainSettingsOverlay}
				/>
			)}
		</div>
	);
};

export default NFTView;
