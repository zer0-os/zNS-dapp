export enum MintDataKey {
	name = 'daoName',
	address = 'gnosisSafeAddress',
}

export const FORM_PLACEHOLDERS = {
	[MintDataKey.name]: 'DAO Name',
	[MintDataKey.address]: 'Gnosis Safe Address',
};

export const FORM_ERRORS = {
	[MintDataKey.name]: 'DAO Name is required',
	[MintDataKey.address]: 'Gnosis Safe Address is required',
};
