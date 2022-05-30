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
	WHEELS_DOMAIN_NAME: 'wilder.wheels.genesis',
};

export const MESSAGES = {
	APPEND_UNCLAIMABLE_TEXT: `${[LABELS.MOTOS]} ${[LABELS.CLAIMABLE]}`,
	APPEND_CLAIMABLE_TEXT: `You can claim`,
	ASSET_ERROR: 'Failed to retrieve domain asset data',
};

export const STATUS_TEXT = {
	LOADING_DETAILS: 'Loading Details...',
	ACCEPT_ZAUCTION_PROMPT:
		'Before you can accept a bid, your wallet needs to approve zAuction. You will only need to do this once. This will cost gas.',
	APPROVING_ZAUCTION:
		'Approving zAuction. This may take up to 20 mins... Please do not close this window or refresh the page.',
	AWAITING_APPROVAL: 'Waiting for approval from your wallet...',
	APPROVED: 'Approved',
};
