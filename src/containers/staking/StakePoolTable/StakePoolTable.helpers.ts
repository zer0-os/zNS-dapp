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
		label: 'APY',
		accessor: '',
		className: '',
	},
	{
		label: 'TVL',
		accessor: '',
		className: '',
	},
	{
		label: 'Stakers',
		accessor: '',
		className: 'lastSale',
	},
	{
		label: 'Total Rewards Issued (WILD)',
		accessor: '',
		className: '',
	},
	{
		label: '',
		accessor: '',
		className: '',
	},
];

export const POOL_DATA = [
	{
		apy: 1002,
		domain: 'wilder.stakewild',
		id: '1',
		image: stakeIcon,
		name: 'Stake Wild',
		numStakers: 125215,
		token: 'WILD',
		totalRewardsIssued: 52185921,
		tvl: 1005525,
	},
	{
		apy: 1002,
		domain: 'wilder.farmwild',
		id: '2',
		image: farmIcon,
		name: 'Farm WILD - WETH LP',
		numStakers: 125215,
		token: 'LP',
		totalRewardsIssued: 52185921,
		tvl: 1005525,
	},
];
