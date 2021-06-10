// Types

export interface Account {
	id: string;
}

export interface Domain {
	id: string;
	name: string;
	parent: string;
	owner: Account;
	minter: Account;
	metadata: string;
}

export interface Metadata {
	title: string;
	description: string;
	image: string;
}

export interface ParentDomain extends Domain {
	subdomains: SubDomain[];
}

export interface SubDomain extends Domain {}

export interface DisplayDomain extends Domain {
	image: string | undefined;
	description: string | undefined;
}

export interface DisplayParentDomain extends DisplayDomain {
	subdomains: DisplayDomain[];
}

// Temporarily in here while we sort middleware
export interface Request {
	creator: Account;
	domain: Domain;
	date: string;
	stakeAmount: number;
	stakeCurrency: string;
	accepted: boolean;
}

// Defaults

export const DefaultDomain: Domain = {
	id: '',
	name: '',
	parent: '',
	owner: {
		id: '',
	},
	minter: {
		id: '',
	},
	metadata: '',
};
