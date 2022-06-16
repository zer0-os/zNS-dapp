import { IDWithClaimStatus } from '@zero-tech/zsale-sdk';

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
	eligibleDomains: IDWithClaimStatus[];
	setEligibleDomains: React.Dispatch<React.SetStateAction<IDWithClaimStatus[]>>;
	setIsClaimingInProgress: (state: boolean) => void;
	statusCallback: (status: string) => void;
	errorCallback: (error: string) => void;
	finishedCallback: () => void;
};
