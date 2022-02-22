export enum ERROR_KEYS {
	NAME = 'NAME',
	SUB_DOMAIN = 'SUBDOMAIN',
	STORY = 'STORY',
	CUSTOM_DOMAIN_HEADER = 'CUSTOM_DOMAIN_HEADER',
}

export enum ERROR_TYPES {
	REQUIRED = 'REQUIRED',
	DUPLICATED = 'DUPLICATED',
	LOWER_CASE = 'LOWER_CASE',
}

export const ERROR_MESSAGES = {
	[ERROR_KEYS.NAME]: {
		[ERROR_TYPES.REQUIRED]: 'NFT name is required',
	},
	[ERROR_KEYS.SUB_DOMAIN]: {
		[ERROR_TYPES.REQUIRED]: 'Domain name is required',
		[ERROR_TYPES.DUPLICATED]: 'Domain name already exists',
		[ERROR_TYPES.LOWER_CASE]: 'Domain name must be lower case',
	},
	[ERROR_KEYS.STORY]: {
		[ERROR_TYPES.REQUIRED]: 'Story is required',
	},
	[ERROR_KEYS.CUSTOM_DOMAIN_HEADER]: {
		[ERROR_TYPES.REQUIRED]: 'Custom domain header is required',
	},
};

export type DomainSettingsError = {
	[ERROR_KEYS.NAME]?: string;
	[ERROR_KEYS.SUB_DOMAIN]?: string;
	[ERROR_KEYS.STORY]?: string;
	[ERROR_KEYS.CUSTOM_DOMAIN_HEADER]?: string;
};
