export enum StepContent {
	Details,
	Claim,
	Minting,
}

export enum Step {
	Details,
	Claim,
	Minting,
}

export enum Stage {
	Countdown,
	Claim,
	Concluded,
}

export type ClaimDropData = {
	dropStage: Stage;
	nftTotal: number;
	totalMinted: number;
};

export type ClaimData = {
	quantity: number;
	statusCallback: (status: string) => void;
	errorCallback: (error: string) => void;
	finishedCallback: () => void;
};
