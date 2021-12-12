import stakeIcon from './assets/stake.png';
import farmIcon from './assets/farm.png';

const POOL_DATA = [
	{
		apy: 5382,
		domain: 'stakewild',
		id: '0x2222222222222222',
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
		domain: 'farmwild',
		id: '0x1111111111111111',
		image: farmIcon,
		name: 'Farm WILD - WETH LP',
		tokenFullName: 'Liquidity Provider',
		numStakers: 3285,
		token: 'LP',
		totalRewardsIssued: 35732195,
		tvl: 2359013158,
	},
];

export default POOL_DATA;
