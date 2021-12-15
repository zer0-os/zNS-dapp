import { PoolInstance } from './temp-sdk/types';
import { ERC20 } from 'types';

export type Pool = {
	address?: string;
	contract?: ERC20;
	hasApproved?: boolean;
	image: string;
	instance?: PoolInstance;
	name: string;
	token: string;
	tokenTicker: string;
	domain: string;
	tokenPurchaseUrl: string;
};

export const wildPool: Pool = {
	image: '/staking/stake.png',
	name: 'Stake WILD',
	token: 'Wilder World',
	tokenTicker: 'WILD',
	domain: '/pools/wild',
	tokenPurchaseUrl:
		'https://app.uniswap.org/#/swap?outputCurrency=0x2a3bff78b79a009976eea096a51a948a3dc00e34&inputCurrency=ETH&use=V2',
};

export const liquidityPool: Pool = {
	image: 'staking/farm.png',
	name: 'Farm WILD - WETH LP',
	token: 'Liquidity Provider',
	tokenTicker: 'LP',
	domain: '/pools/lp',
	tokenPurchaseUrl: '',
};
