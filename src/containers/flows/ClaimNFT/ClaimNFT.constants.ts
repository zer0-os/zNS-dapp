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

export const MESSAGES = {
	APPEND_UNCLAIMABLE_TEXT: `${[LABELS.MOTOS]} ${[LABELS.CLAIMABLE]}`,
	APPEND_CLAIMABLE_TEXT: `You can claim`,
	ASSET_ERROR: 'Failed to retrieve domain asset data',
};
