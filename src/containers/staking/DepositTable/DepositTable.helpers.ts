import stakeIcon from './assets/stake.png';
import farmIcon from './assets/farm.png';

export const TABLE_HEADERS = [
	{
		label: '',
		accessor: '',
		className: '',
	},
	{
		label: 'Pool',
		accessor: '',
		className: '',
	},
	{
		label: 'Date Staked',
		accessor: '',
		className: '',
	},
	{
		label: 'Amount',
		accessor: '',
		className: '',
	},
	{
		label: 'Lock Period',
		accessor: '',
		className: '',
	},
];

export const DEPOSIT_DATA = [
	{
		name: 'Stake Wild',
		domain: 'stakewild',
		token: 'WILD',
		image: stakeIcon,
		dateStaked: new Date(),
		stakeAmount: 2351326,
		stakeRewards: 63216,
		stakeRewardsVested: 0,
	},
	{
		name: 'Stake Wild',
		domain: 'stakewild',
		token: 'WILD',
		image: stakeIcon,
		dateStaked: new Date(),
		stakeAmount: 4316431,
		stakeRewards: 64316,
		stakeRewardsVested: 2356,
	},
	{
		name: 'Farm WILD - WETH LP',
		domain: 'farmwild',
		token: 'LP',
		image: farmIcon,
		dateStaked: new Date(),
		stakeAmount: 64316,
		stakeRewards: 1264,
		stakeRewardsVested: 0,
	},
];
