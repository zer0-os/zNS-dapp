/**
 * Warning & Success
 */
export enum DomainSettingsWarning {
	LOCKED = 'LOCKED',
	TRANSACTION_DENIED = 'TRANSACTION_DENIED',
}

export enum DomainSettingsSuccess {
	MEATA_DATA_SAVED = 'MEATA_DATA_SAVED',
}

export const DOMAIN_SETTINGS_WARNING_MESSAGES = {
	[DomainSettingsWarning.LOCKED]: 'Please unlock to make changes',
	[DomainSettingsWarning.TRANSACTION_DENIED]: 'Transaction denied by wallet',
};

export const DOMAIN_SETTINGS_SUCCESS_MESSAGES = {
	[DomainSettingsSuccess.MEATA_DATA_SAVED]: 'Your changes have been saved',
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
				'Waiting wallet confirmation...',
			[DomainSettingsModalStatus.PROCESSING]:
				'Locking metadata... This may take up to x mins. Do not close this window or refresh your browser...',
		},
	} as DomainSettingsModalOptions,
	[DomainSettingsModalType.UNLOCK]: {
		type: DomainSettingsModalType.UNLOCK,
		title: 'Unlock Metadata?',
		description: {
			[DomainSettingsModalStatus.NORMAL]:
				'Unlocking metadata is a blockchain transaction that will cost gas. Additional, optional, transactions are required to save chagnes and lock the metadata again.',
			[DomainSettingsModalStatus.WALLET_CONFIRMATION]:
				'Waiting wallet confirmation...',
			[DomainSettingsModalStatus.PROCESSING]:
				'Unlocking metadata... This may take up to x mins. Do not close this window or refresh your browser...',
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
				'Waiting wallet confirmation...',
			[DomainSettingsModalStatus.PROCESSING]:
				'Saving metadata changes... This may take up to x mins. Do not close this window or refresh your browser...',
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
				'Your changes will be saved and the metadata will be locked. You will be the only one who can unlock it in the feature.',
			[DomainSettingsModalStatus.WALLET_CONFIRMATION]:
				'Waiting wallet confirmation...',
			[DomainSettingsModalStatus.PROCESSING]:
				'Save & locking metadata changes... This may take up to x mins. Do not close this window or refresh your browser...',
		},
		buttons: {
			confirm: 'Save & Lock',
			cancel: 'Return',
		},
	} as DomainSettingsModalOptions,
};
