export enum Step {
	None = 'None',
	Unlock = 'Unlock',
	Mint = 'Mint',
}

export enum StepStatus {
	Normal = 'Normal',
	Confirm = 'Confirm',
	Processing = 'Processing',
}

export enum ErrorType {
	Signature = 'Signature',
	Library = 'Library',
}

export type StepWizard = {
	title: string;
	children: JSX.Element;
};

export type MintData = {
	daoName: string;
	gnosisSafeAddress: string;
};
