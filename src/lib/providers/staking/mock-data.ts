import stakeIcon from './assets/stake.png';
import farmIcon from './assets/farm.png';

export const POOL_DATA = [
	{
		apy: 5382,
		domain: 'wild',
		id: '0x2',
		image: stakeIcon,
		name: 'Stake Wild',
		numStakers: 23589,
		token: 'WILD',
		tokenFullName: 'Wilder World',
		totalRewardsIssued: 5382915,
		tvl: 192835,
	},
	{
		apy: 105302,
		domain: 'lp',
		id: '0x1',
		image: farmIcon,
		name: 'Farm WILD - WETH LP',
		tokenFullName: 'Liquidity Provider',
		numStakers: 3285,
		token: 'LP',
		totalRewardsIssued: 35732195,
		tvl: 2359013158,
	},
];

export const DEPOSIT_DATA = [
	{
		id: '1',
		pool: POOL_DATA[1],
		dateStaked: new Date(),
		stakeAmount: 2351326,
		stakeRewards: 63216,
		stakeRewardsVested: 0,
	},
	{
		id: '2',
		pool: POOL_DATA[0],
		dateStaked: new Date(),
		stakeAmount: 4316431,
		stakeRewards: 64316,
		stakeRewardsVested: 2356,
	},
	{
		id: '3',
		pool: POOL_DATA[1],
		dateStaked: new Date(),
		stakeAmount: 64316,
		stakeRewards: 1264,
		stakeRewardsVested: 0,
	},
];
