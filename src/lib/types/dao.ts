import { AssetType, Coin, Collectible } from '@zero-tech/zdao-sdk';

export interface WrappedCollectible extends Collectible {
	type: AssetType;
	amount?: number;
	amountInUSD?: number;
}

export type Asset = Coin | WrappedCollectible;
