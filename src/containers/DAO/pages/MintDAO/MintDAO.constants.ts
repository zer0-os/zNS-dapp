import { Step, StepStatus, ErrrorType } from './MintDAO.types';

export const TITLES = {
	[Step.Unlock]: {
		[StepStatus.Normal]: 'Mint a DAO at This ?',
		[StepStatus.Confirm]: 'Mint a DAO at This Domain?',
		[StepStatus.Processing]: 'Mint a DAO at This Domain?',
	},
	[Step.Mint]: {
		[StepStatus.Normal]: 'Enter Your Gnosis Address',
		[StepStatus.Confirm]: 'Minting DAO',
		[StepStatus.Processing]: 'Minting DAO',
	},
};

export const MESSAGES = {
	[Step.Unlock]: {
		[StepStatus.Normal]:
			'You can mint a DAO at this domain by entering the address of an existing GnosisSig. \n\n It will cost gas to unlock this domains metadata and again to mint a DAO and lock the metadata.',
		[StepStatus.Confirm]: 'Awaiting wallet confirmation...',
		[StepStatus.Processing]:
			'Unlocking metadata... This may take up to x mins. Do not close this window or refresh your browser...',
	},
	[Step.Mint]: {
		[StepStatus.Confirm]: 'Awaiting wallet confirmation...',
		[StepStatus.Processing]:
			'Minting DAO... This may take up to x mins. Do not close this window or refresh your browser...',
	},
};

export const SUCCESS = {
	[Step.Mint]: 'DAO Created Successfully',
};

export const ERRORS = {
	[ErrrorType.Signature]: 'Failed to generate signature.',
	[ErrrorType.Transaction]: 'Transaction failed.',
	[ErrrorType.Library]: 'Failed to connect with Web3 wallet.',
};

export const BUTTONS = {
	[Step.Unlock]: { PRIMARY: 'Unlock', SECONDARY: 'Cancel' },
	[Step.Mint]: { PRIMARY: 'Mint DAO', SECONDARY: 'Cancel' },
};
