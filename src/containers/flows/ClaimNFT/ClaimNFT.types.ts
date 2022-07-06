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

export type ClaimData = {
	quantity: number;
	eligibleDomains: ClaimableDomain[];
	setEligibleDomains: React.Dispatch<React.SetStateAction<ClaimableDomain[]>>;
	setIsClaimingInProgress: (state: boolean) => void;
	setStatus: (status: string) => void;
	onError: (error: string) => void;
	onFinish: () => void;
};
