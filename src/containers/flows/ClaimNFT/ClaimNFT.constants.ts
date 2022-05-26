//- Types
import { StepContent } from './ClaimNFT.types';

const TITLES = {
	CLAIMING: 'Your Moto Awaits',
	CLAIMED: 'Minting your Moto',
};

export const STEP_CONTENT_TITLES = {
	[StepContent.Details]: TITLES.CLAIMING,
};

export const STEP_BAR_HEADING = ['Details', 'Claim', 'Success'];
