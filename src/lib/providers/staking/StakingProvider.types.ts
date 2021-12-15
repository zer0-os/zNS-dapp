export type Pool = {
	apy?: number;
	domain: string;
	id: string;
	image: string;
	name: string;
	numStakers?: number;
	token: string;
	tokenFullName: string;
	totalRewardsIssued?: number;
	tvl?: number;
};

export type Deposit = {
	id: string;
	pool: Pool;
	dateStaked: number;
	stakeAmount: number;
	stakeRewards: number;
	stakeRewardsVested: number;
};
