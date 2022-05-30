//- React Imports
import React, { useCallback, useMemo } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core'; // Wallet data
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'; // Wallet data

//- Component Imports
import {
	Actions,
	NFT,
	Stats,
	TokenHashBoxes,
	Attributes,
	History,
} from './elements';

//- Library Imports
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';

//- Type Imports
import { Option } from 'components/Dropdowns/OptionDropdown/OptionDropdown';
import { MediaType } from 'components/NFTMedia/config';

//- Hooks
import {
	useNftData,
	useViewBidsData,
	useAsset,
	useNFTViewModal,
	useNftMediaAsset,
} from './hooks';

//- Constants Imports
import {
	getActionFeatures,
	NFT_MORE_ACTIONS_TITLE,
	NFT_DOWNLOAD_ACTIONS,
} from './NFTView.constants';

//- Style Imports
import styles from './NFTView.module.scss';
import { ethers } from 'ethers';
import { NFTViewModalType } from './providers/NFTViewModalProvider/NFTViewModalProvider.types';

//- Componennt level type definitions
type NFTViewProps = {
	onTransfer: () => void;
};

const NFTView: React.FC<NFTViewProps> = ({ onTransfer }) => {
	//- Web3 Wallet Data
	const { account, chainId } = useWeb3React<Web3Provider>();

	//- Current Domain Data
	const {
		domainId,
		domain: znsDomain,
		domainMetadata,
		paymentTokenInfo,
	} = useCurrentDomain();

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
		refetch,
	} = useNftData();

	//- NFT Media Asset
	const mediaAsset = useNftMediaAsset({ znsDomain });

	//- View Bids Hook Data
	const { isBidDataLoading, allBids, viewBidsDomainData } = useViewBidsData();

	//- Asset Hook Data
	const { downloadAsset, shareAsset } = useAsset();

	//- Modal Provider Hook
	const { openModal, closeModal } = useNFTViewModal();
	//- Memoized data
	const {
		isBiddable,
		isOwnedByYou,
		assetUrl,
		nftDownloadOptions,
		nftMoreOptions,
	} = useMemo(() => {
		const isRootDomain = (znsDomain?.name || '').split('.').length <= 2;
		const isOwnedByYou =
			znsDomain?.owner.id.toLowerCase() === account?.toLowerCase();
		const isBiddable =
			(isRootDomain && !isOwnedByYou) || Boolean(domainMetadata?.isBiddable);
		const assetUrl =
			znsDomain?.animation_url || znsDomain?.image_full || znsDomain?.image;
		const nftMoreOptions = isOwnedByYou
			? getActionFeatures(Boolean(buyNowPrice), allBids?.length !== 0)
			: [];

		const nftDownloadOptions = [];
		if (mediaAsset.imageAsset.isAvailable) {
			nftDownloadOptions.push({
				...NFT_DOWNLOAD_ACTIONS[MediaType.Image],
				assetUrl: mediaAsset.imageAsset.url!,
			});
		}
		if (mediaAsset.videoAsset.isAvailable) {
			nftDownloadOptions.push({
				...NFT_DOWNLOAD_ACTIONS[MediaType.Video],
				assetUrl: mediaAsset.videoAsset.url!,
			});
		}

		return {
			isBiddable,
			isOwnedByYou,
			assetUrl,
			nftDownloadOptions,
			nftMoreOptions,
		};
	}, [znsDomain, domainMetadata, account, mediaAsset, buyNowPrice, allBids]);

	// Convert highest bid as wei
	const highestBidAsWei =
		highestBid && ethers.utils.parseEther(highestBid.toString()).toString();

	///////////////
	// Functions //
	///////////////

	const handleOnAccept = () => {
		refetch();
		closeModal();
	};

	const onBid = useCallback(async () => {
		getPriceData();
		getHistory();
	}, [getHistory, getPriceData]);

	const handleOnBid = () => {
		onBid();
		closeModal();
	};

	// Open Make A Bid Modal
	const openMakeABid = () => {
		openModal({
			modalType: NFTViewModalType.MAKE_A_BID,
			contentProps: {
				domain: znsDomain!,
				onBid: handleOnBid,
				onClose: closeModal,
				paymentTokenInfo: paymentTokenInfo,
			},
		});
	};

	// Open Domain Settings Modal
	const openDomainSettings = () => {
		openModal({
			modalType: NFTViewModalType.DOMAIN_SETTINGS,
			contentProps: {
				domainId: domainId,
				onClose: closeModal,
			},
		});
	};

	// Open Domain Settings Modal
	const openSetBuyNow = () => {
		openModal({
			modalType: NFTViewModalType.SET_BUY_NOW,
			contentProps: {
				domainId: domainId,
				onCancel: closeModal,
				onSuccess: refetch,
				paymentTokenInfo: paymentTokenInfo,
			},
		});
	};

	// Open Bid List Modal
	const openBidList = () => {
		openModal({
			modalType: NFTViewModalType.BID_LIST,
			contentProps: {
				bids: allBids ?? [],
				domain: viewBidsDomainData,
				domainMetadata: domainMetadata ?? undefined,
				onAccept: handleOnAccept,
				isLoading: isBidDataLoading,
				highestBid: String(highestBidAsWei),
				paymentTokenInfo: paymentTokenInfo,
			},
		});
	};

	// Dropdown Option Select
	const onSelectOption = (option: Option) => {
		if (option.title === NFT_MORE_ACTIONS_TITLE.MY_DOMAIN_SETTINGS) {
			return openDomainSettings();
		} else if (option.title === NFT_MORE_ACTIONS_TITLE.TRANSFER_OWNERSHIP) {
			return onTransfer();
		} else if (
			option.title === NFT_MORE_ACTIONS_TITLE.SET_BUY_NOW ||
			option.title === NFT_MORE_ACTIONS_TITLE.EDIT_BUY_NOW
		) {
			return openSetBuyNow();
		} else if (option.title === NFT_MORE_ACTIONS_TITLE.VIEW_BIDS) {
			return openBidList();
		}
	};

	////////////
	// Render //
	////////////

	return (
		<div className={styles.NFTView}>
			<NFT
				owner={znsDomain?.owner.id as string}
				title={domainMetadata?.title as string}
				assetUrl={assetUrl as string}
				creator={znsDomain?.minter.id as string}
				downloadOptions={nftDownloadOptions}
				description={znsDomain?.description as string}
				onDownload={downloadAsset}
				onShare={shareAsset}
				moreOptions={nftMoreOptions}
				onMoreSelectOption={onSelectOption}
			/>

			<Actions
				domainId={znsDomain?.id}
				highestBid={highestBid}
				buyNowPrice={buyNowPrice}
				onMakeBid={openMakeABid}
				onViewBids={openBidList}
				yourBid={yourBid}
				isOwnedByUser={isOwnedByYou}
				refetch={refetch}
				isBiddable={isBiddable}
				bidData={allBids}
				paymentTokenInfo={paymentTokenInfo}
			/>

			<Stats
				znsDomain={znsDomain}
				bids={bids}
				paymentTokenInfo={paymentTokenInfo}
				isLoading={isHistoryLoading}
			/>

			<Attributes znsDomain={znsDomain} />

			<TokenHashBoxes
				domainId={domainId}
				chainId={chainId}
				znsDomain={znsDomain}
			/>

			<History
				isLoading={isHistoryLoading}
				history={history}
				paymentTokenInfo={paymentTokenInfo}
			/>
		</div>
	);
};

export default NFTView;
