import { ClaimableDomain } from '@zero-tech/zsale-sdk';

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
	eligibleDomains: ClaimableDomain[];
	setEligibleDomains: React.Dispatch<React.SetStateAction<ClaimableDomain[]>>;
	setIsClaimingInProgress: (state: boolean) => void;
	statusCallback: (status: string) => void;
	errorCallback: (error: string) => void;
	finishedCallback: () => void;
};
