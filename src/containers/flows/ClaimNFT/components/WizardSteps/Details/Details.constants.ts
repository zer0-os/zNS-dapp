export const VIDEO_FORMAT_TYPE = {
	NFT_JPEG: '',
	NFT_WEBM: 'video/webm',
	NFT_MP4: 'video/mp4',
	NFT_OGG: 'video/ogg',
};

export const VIDEO_FORMAT_SRC = {
	[VIDEO_FORMAT_TYPE.NFT_JPEG]: '',
	[VIDEO_FORMAT_TYPE.NFT_WEBM]: '',
	[VIDEO_FORMAT_TYPE.NFT_MP4]: '',
	[VIDEO_FORMAT_TYPE.NFT_OGG]: '',
};

export const VIDEO_SETTINGS = {
	CONTROL_LIST: 'nodownload noremoteplayback noplaybackrate nofullscreen',
	PRELOAD: 'metadata',
};

export const TEXT_INPUT = {
	PLACEHOLDER: 'Token ID',
	BUTTON: 'Check',
	TYPE: 'text',
	CLAIM_CONSUMED_ERROR: 'This Wheel has already been used to claim a Moto',
	CLAIM_CONSUMED_SUCCESS: 'This Wheel has a moto claim available',
	UNABLE_TO_RETRIEVE: 'Unable to retrieve data for Token ID.',
};

export const TOOLTIP = {
	DETAILS:
		'You can find the Token ID of a Wheel here in the NFTs app or in the ‘Details’ section on Opensea.',
	MINTING:
		'This may take up to 20 mintutes depending on the state of the Ethereum blockchain.',
	UNCLAIMABLE:
		'Your wallet must hold Wilder Wheels with an unused claim to claim a moto.',
	CLAIMABLE:
		'You can claim up to the maximum number of Wheels you hold in this wallet.',
};

export const MESSAGES = {
	CONNECT_WALLET_PROMPT:
		'Connect a wallet which holds Wilder Wheels to claim Motos',
	SEARCH_PROMPT:
		'Optional: Enter a Wheel token ID to check if it can be used to claim',
	MINTING_PROMPT: 'Minting your moto',
	READ_MORE: 'Read more about claiming',
	COST_PROMPT: 'You only need to pay gas!',
	CLOSE_PROMPT:
		'You may close this and minting will continue in the backround. When minting is complete, you can view your Moto in your profile (may require a page refresh).',
};

export const BUTTONS = {
	CONNECT_WALLET: 'Connect Wallet',
	BUY_WHEELS: 'Buy Wheels',
	START_CLAIMING: 'Start Claiming',
	FINISH: 'Finish',
};
