import stakeIcon from './assets/stake.png';
import farmIcon from './assets/farm.png';
import { ethers } from 'ethers';

export const TOKENS = [
	{
		name: 'WILD',
		fullName: 'Wilder World',
	},
];

export const POOL_DATA = [
	{
		apy: 5382,
		domain: 'wild',
		id: undefined,
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
		id: undefined,
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
		depositId: '1',
		pool: POOL_DATA[1],
		stakeAmount: 2351326,
		lockedFrom: ethers.BigNumber,
		lockedUntil: ethers.BigNumber,
	},
	{
		depositId: '2',
		pool: POOL_DATA[0],
		dateStaked: new Date(),
		stakeAmount: 4316431,
	},
	{
		depositId: '2',
		pool: POOL_DATA[0],
		dateStaked: new Date(),
		stakeAmount: 4316431,
	},
];
