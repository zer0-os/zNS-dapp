export enum STATUS {
	CLAIM,
	CLAIMED,
}

export enum BOX_CONTENT {
	CLAIM_STATUS = 'Claim Status',
	TOKEN_ID = 'Token ID',
	IPFS_HASH = 'IPFS Hash',
}

export const LINK_TEXT = {
	[BOX_CONTENT.CLAIM_STATUS]: 'Claim Moto',
	[BOX_CONTENT.TOKEN_ID]: 'View on Etherscan',
	[BOX_CONTENT.IPFS_HASH]: 'View on IPFS',
};

export const TOOLTIP = {
	[STATUS.CLAIM]:
		'During the claim period, Wilder Wheels can be used to claim a Moto. Claim now!',
	[STATUS.CLAIMED]: 'This Wheel has already been used to claim a Moto.',
};

export const STATUS_TEXT = {
	[STATUS.CLAIM]: 'Moto Available To Claim',
	[STATUS.CLAIMED]: 'Moto Has Been Claimed',
};

export enum LABELS {
	WILDER_WHEELS_ZNA = 'wheels.genesis.',
}
