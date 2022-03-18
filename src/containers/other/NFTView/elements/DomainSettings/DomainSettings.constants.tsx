/**
 * Warning & Success
 */
export enum DomainSettingsWarning {
	LOCKED = 'LOCKED',
	TRANSACTION_DENIED = 'TRANSACTION_DENIED',
	TRANSACTION_FAILED = 'TRANSACTION_FAILED',
}

export enum DomainSettingsSuccess {
	MEATA_DATA_SAVED = 'MEATA_DATA_SAVED',
	MEATA_DATA_SAVED_AND_LOCKED = 'MEATA_DATA_SAVED_AND_LOCKED',
}

export const DOMAIN_SETTINGS_WARNING_MESSAGES = {
	[DomainSettingsWarning.LOCKED]: 'Please unlock to make changes.',
	[DomainSettingsWarning.TRANSACTION_DENIED]: 'Transaction denied by wallet.',
	[DomainSettingsWarning.TRANSACTION_FAILED]:
		'Transaction failed, try again later.',
};

export const DOMAIN_SETTINGS_SUCCESS_MESSAGES = {
	[DomainSettingsSuccess.MEATA_DATA_SAVED]: 'Your changes have been saved',
	[DomainSettingsSuccess.MEATA_DATA_SAVED_AND_LOCKED]:
		'Your changes have been saved and locked',
};

/**
 * Modals
 */

export enum DomainSettingsModalType {
	LOCK = 'LOCK',
	UNLOCK = 'UNLOCK',
	SAVE_WITHOUT_LOCKING = 'SAVE_WITHOUT_LOCKING',
	SAVE_AND_LOCK = 'SAVE_AND_LOCK',
}

export enum DomainSettingsModalStatus {
	NORMAL = 'normal',
	WALLET_CONFIRMATION = 'wallet_confirmation',
	PROCESSING = 'processing',
}

type DomainSettingsModalOptions = {
	type: DomainSettingsModalType;
	title: string;
	buttons?: {
		confirm: string;
		cancel: string;
	};
	description: {
		[DomainSettingsModalStatus.NORMAL]?: string;
		[DomainSettingsModalStatus.WALLET_CONFIRMATION]: string;
		[DomainSettingsModalStatus.PROCESSING]: string;
	};
};

export const DOMAIN_SETTINGS_MODALS = {
	[DomainSettingsModalType.LOCK]: {
		type: DomainSettingsModalType.LOCK,
		title: 'Locking Metadata',
		description: {
			[DomainSettingsModalStatus.WALLET_CONFIRMATION]:
				'Waiting for Wallet Confirmation...',
			[DomainSettingsModalStatus.PROCESSING]:
				'Locking metadata... This may take up to 20 mins. Do not close this window or refresh your browser...',
		},
	} as DomainSettingsModalOptions,
	[DomainSettingsModalType.UNLOCK]: {
		type: DomainSettingsModalType.UNLOCK,
		title: 'Unlock Metadata?',
		description: {
			[DomainSettingsModalStatus.NORMAL]:
				'Unlocking metadata is a blockchain transaction that will cost gas. Additional, optional, transactions are required to save changes and lock the metadata again.',
			[DomainSettingsModalStatus.WALLET_CONFIRMATION]:
				'Waiting for Wallet Confirmation...',
			[DomainSettingsModalStatus.PROCESSING]:
				'Unlocking metadata... This may take up to 20 mins. Do not close this window or refresh your browser...',
		},
		buttons: {
			confirm: 'Unlock',
			cancel: 'Cancel',
		},
	} as DomainSettingsModalOptions,
	[DomainSettingsModalType.SAVE_WITHOUT_LOCKING]: {
		type: DomainSettingsModalType.SAVE_WITHOUT_LOCKING,
		title: 'Save Without Locking?',
		description: {
			[DomainSettingsModalStatus.NORMAL]:
				'If you transfer ownership of the domain while metadata is unlocked, the new owner can edit the metadata and lock it. You may lose access forever.',
			[DomainSettingsModalStatus.WALLET_CONFIRMATION]:
				'Waiting for Wallet Confirmation...',
			[DomainSettingsModalStatus.PROCESSING]:
				'Saving metadata changes... This may take up to 20 mins. Do not close this window or refresh your browser...',
		},
		buttons: {
			confirm: 'Save without locking',
			cancel: 'Return',
		},
	} as DomainSettingsModalOptions,
	[DomainSettingsModalType.SAVE_AND_LOCK]: {
		type: DomainSettingsModalType.SAVE_AND_LOCK,
		title: 'Save & Lock?',
		description: {
			[DomainSettingsModalStatus.NORMAL]:
				'Your changes will be saved and the metadata will be locked. You will be the only one who can unlock it in the future.',
			[DomainSettingsModalStatus.WALLET_CONFIRMATION]:
				'Waiting for Wallet Confirmation...',
			[DomainSettingsModalStatus.PROCESSING]:
				'Save & locking metadata changes... This may take up to 20 mins. Do not close this window or refresh your browser...',
		},
		buttons: {
			confirm: 'Save & Lock',
			cancel: 'Return',
		},
	} as DomainSettingsModalOptions,
};

/**
 * Tooltips
 */
export enum DomainSettingsTooltipType {
	LOCKED = 'LOCKED',
	UNLOCKED = 'UNLOCKED',
	SAVED_AND_UNLOCKED = 'SAVED_AND_UNLOCKED',
	SETTINGS_MINT_REQUEST = 'SETTINGS_MINT_REQUEST',
	UNLSETTINGS_BIDDING = 'UNLSETTINGS_BIDDING',
	SETTINGS_GRID_VIEW_DEFAULT = 'SETTINGS_GRID_VIEW_DEFAULT',
	SETTINGS_CUSTOM_DOMAIN_HEADER = 'SETTINGS_CUSTOM_DOMAIN_HEADER',
}

export const DOMAIN_SETTINGS_TOOLTIPS = {
	[DomainSettingsTooltipType.LOCKED]:
		'Metadata is locked. Only the person who locked it may unlock and make changes.',
	[DomainSettingsTooltipType.UNLOCKED]:
		'You may save changes leaving the metadata unlocked for the next owner to edit, or save & lock the metadata preventing future edits by anyone other than you.',
	[DomainSettingsTooltipType.SAVED_AND_UNLOCKED]:
		'Metadata is unlocked, if you transfer ownership of this domain, the new owner can edit metadata and lock it. You may lose access forever. You can lock the metadata preventing future edits by anyone other than you.',
	[DomainSettingsTooltipType.SETTINGS_MINT_REQUEST]:
		'Allow members to make a stake offer in order to mint NFTs on your domain. Turn off if your domain is not intended to be open for others to mint upon',
	[DomainSettingsTooltipType.UNLSETTINGS_BIDDING]:
		'Allow bidding on your domain. Turn off if the domain is not intended to be sold.',
	[DomainSettingsTooltipType.SETTINGS_GRID_VIEW_DEFAULT]:
		'Grid view has larger image previews which can benefit domains with a focus on art rather than statistics.',
	[DomainSettingsTooltipType.SETTINGS_CUSTOM_DOMAIN_HEADER]:
		'Change the first column header of list view. By default this is ‘Domain’.',
};
