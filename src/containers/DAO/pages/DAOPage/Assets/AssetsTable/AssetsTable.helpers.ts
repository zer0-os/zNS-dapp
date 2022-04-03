import { Asset } from 'lib/types/dao';
import { toFiat } from 'lib/currency';
import { TableAsset } from './AssetsTableRow';
import defaultAssetIcon from 'assets/default_asset.png';

/**
 * Converts an Asset to a TableAsset
 * @param asset to convert
 * @returns asset as TableAsset
 */
export const convertAsset = (asset: Asset): TableAsset => {
	const a = asset as any;

	const amount = a.amount ?? 1;

	return {
		amount,
		decimals: a.decimals ?? 0,
		image: a.metadata?.image ?? a.logoUri ?? defaultAssetIcon,
		key: amount + a.address,
		name: a.metadata?.name ?? a.metadata?.title ?? a.name ?? a.tokenName,
		subtext: a.symbol ?? a.tokenSymbol,
		amountInUSD:
			a.amountInUSD !== undefined ? '$' + toFiat(a.amountInUSD) : '-',
	};
};
