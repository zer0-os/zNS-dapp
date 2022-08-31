//- Asset Imports
import downloadImageIcon from './assets/image.svg';
import downloadVideoIcon from './assets/video.svg';
import cubeIcon from './assets/cube-icon.svg';
import transferOwnershipIcon from './assets/transfer.svg';
import dollarSignIcon from './assets/dollar-sign.svg';
import tagIcon from './assets/tag-icon.svg';

//- Component Imports
import { MediaType } from 'components/NFTMedia/config';

export enum NFT_ASSET_URLS {
	VIDEO = 'https://res.cloudinary.com/fact0ry/video/upload/c_fit,h_900,w_900,fps_1-24,f_mp4,vc_h264,ac_aac/v1631501273/zns/NFT_ASSET_HASH.mp4',
	IMAGE = 'https://res.cloudinary.com/fact0ry/image/upload/c_fit,h_1900,w_1200,q_auto/v1631501273/zns/NFT_ASSET_HASH.jpg',
}

export enum NFT_ASSET_SHARE_KEYS {
	TWITTER = 'TWITTER',
}

export const NFT_ASSET_SHARE_OPTIONS = {
	[NFT_ASSET_SHARE_KEYS.TWITTER]: {
		URL: 'https://twitter.com/share?url=NFT_ASSET_DOMAIN_URL',
		OPTIONS:
			'menubar=no,toolbar=no,resizable=no,scrollbars=no,personalbar=no,height=575,width=500',
	},
};

export const NFT_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT = {
	MOBILE: 5,
	TABLET: 7,
	DESKTOP: 11,
};

export enum NFT_DOWNLOAD_ACTIONS_TITLE {
	DOWNLOAD_IMAGE = 'Static Image (PFP)',
	DOWNLOAD_VIDEO = 'Full Animation',
}

export const NFT_DOWNLOAD_ACTIONS = {
	[MediaType.Image]: {
		icon: downloadImageIcon,
		title: NFT_DOWNLOAD_ACTIONS_TITLE.DOWNLOAD_IMAGE,
	},
	[MediaType.Video]: {
		icon: downloadVideoIcon,
		title: NFT_DOWNLOAD_ACTIONS_TITLE.DOWNLOAD_VIDEO,
	},
};

export enum NFT_MORE_ACTIONS_TITLE {
	VIEW_BIDS = 'View Bids',
	SET_BUY_NOW = 'Set Buy Now Price',
	EDIT_BUY_NOW = 'Edit Buy Now Price',
	TRANSFER_OWNERSHIP = 'Transfer Ownership',
	MY_DOMAIN_SETTINGS = 'My Domain Settings',
}

export enum MESSAGES {
	DOWNLOAD = 'Download starting',
	DOWNLOAD_SUCCESSFUL = 'Download successful',
	DOWNLOAD_ERROR = 'Failed to download',
	CONSOLE_ERROR = 'Failed to retrieve bid data',
	ASSET_ERROR = 'Failed to retrieve domain asset data',
}

export const getActionFeatures = (
	isBuyNowPriceSet: boolean,
	isViewBids: boolean,
) => {
	const NFT_MORE_ACTIONS = [
		{
			icon: dollarSignIcon,
			title: NFT_MORE_ACTIONS_TITLE.VIEW_BIDS,
		},

		{
			icon: tagIcon,
			title: isBuyNowPriceSet
				? NFT_MORE_ACTIONS_TITLE.EDIT_BUY_NOW
				: NFT_MORE_ACTIONS_TITLE.SET_BUY_NOW,
		},
		{
			icon: transferOwnershipIcon,
			title: NFT_MORE_ACTIONS_TITLE.TRANSFER_OWNERSHIP,
		},
		{
			icon: cubeIcon,
			title: NFT_MORE_ACTIONS_TITLE.MY_DOMAIN_SETTINGS,
		},
	];

	const filteredActions = NFT_MORE_ACTIONS.filter(
		(item) => item.title !== NFT_MORE_ACTIONS_TITLE.VIEW_BIDS,
	);

	const actions = isViewBids ? NFT_MORE_ACTIONS : filteredActions;

	return actions;
};
