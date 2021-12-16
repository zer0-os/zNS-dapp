import { PoolInstance } from '@zero-tech/zfi-sdk/lib/types';

export interface StakingPoolContent {
	image: string;
	name: string;
	token: string;
	tokenTicker: string;
	domain: string;
	tokenPurchaseUrl: string;
}

export interface StakingPoolMetrics {
	apy?: number;
}

export interface WrappedStakingPool {
	instance: PoolInstance;
	content: StakingPoolContent;
	metrics: StakingPoolMetrics;
}

export interface WrappedStakingPools {
	wildPool: WrappedStakingPool;
	lpPool: WrappedStakingPool;
}

const wildPool: StakingPoolContent = {
	image: '/staking/stake.png',
	name: 'Stake WILD',
	token: 'Wilder World',
	tokenTicker: 'WILD',
	domain: '/pools/wild',
	tokenPurchaseUrl:
		'https://app.uniswap.org/#/swap?outputCurrency=0x2a3bff78b79a009976eea096a51a948a3dc00e34&inputCurrency=ETH&use=V2',
};

const lpPool: StakingPoolContent = {
	image: 'staking/farm.png',
	name: 'Farm WILD - WETH LP',
	token: 'Liquidity Provider',
	tokenTicker: 'LP',
	domain: '/pools/lp',
	tokenPurchaseUrl: '',
};

export const poolContent = {
	wildPool,
	lpPool,
};
