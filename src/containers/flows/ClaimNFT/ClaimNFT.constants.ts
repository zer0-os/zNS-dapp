//- Types
import { StepContent } from './ClaimNFT.types';

const TITLES = {
	CLAIMING: 'Your Moto Awaits',
	MINTING: 'Minting your Moto',
};

export const STEP_CONTENT_TITLES = {
	[StepContent.Details]: TITLES.CLAIMING,
	[StepContent.Claim]: TITLES.CLAIMING,
	[StepContent.Minting]: TITLES.MINTING,
};

export const STEP_BAR_HEADING = ['Details', 'Claim', 'Minting'];

export const LABELS = {
	CLAIMABLE: 'Claimable',
	MOTOS: 'Motos',
};

export const DOMAINS = {
	ELIGIBLE_NFT_ROUTE: '/wheels.genesis',
	CURRENT_CLAIM_ROUTE: '/moto.genesis',
	WHEELS_DOMAIN_NAME: 'wilder.wheels.genesis',
};

export const MESSAGES = {
	APPEND_UNCLAIMABLE_TEXT: `${[LABELS.MOTOS]} ${[LABELS.CLAIMABLE]}`,
	APPEND_CLAIMABLE_TEXT: `You can claim`,
	ASSET_ERROR: 'Failed to retrieve domain asset data',
	REJECTED_WALLET: 'Transaction denied by wallet',
	FAILED_TO_RETRIEVE_DATA: 'Failed to retrieve primary data',
	SALE_ENDED: 'Sale has ended',
};

export const LOADING_TEXT = {
	LOADING_DETAILS: 'Loading Details...',
};
