import millify from 'millify';
import { formatUnits } from 'ethers/lib/utils';
import { Proposal, TokenMetaData } from '@zero-tech/zdao-sdk';
import { Asset } from 'lib/types/dao';
import { toFiat } from 'lib/currency';
import { randomUUID } from 'lib/random';
import { ProposalTableDataItem } from './ProposalsTable.type';
import {
	MILLIFY_PRECISION,
	MILLIFY_LOWERCASE,
} from './ProposalsTable.constants';
import defaultAssetIcon from 'assets/default_asset.png';
import wildIcon from 'assets/WWLogo-Padded.svg';

/**
 * Converts an Asset to ProposalTableDataItem
 * @param asset to convert
 * @returns asset as ProposalTableDataItem
 */
export const convertAsset = (asset: Asset): ProposalTableDataItem => {
	const a = asset as any;

	const amount = a.amount ?? 1;
	const symbol = a.symbol ?? a.tokenSymbol;
	const image =
		symbol === 'WILD'
			? wildIcon
			: a.metadata?.image ?? a.logoUri ?? defaultAssetIcon;

	return {
		amount,
		decimals: a.decimals ?? 0,
		image: image,
		key: amount + a.address,
		name: a.metadata?.name ?? a.metadata?.title ?? a.name ?? a.tokenName,
		subtext: a.symbol ?? a.tokenSymbol,
		amountInUSD:
			a.amountInUSD !== undefined ? '$' + toFiat(a.amountInUSD) : '-',
		uuid: randomUUID(),
	};
};

export const isZnsToken = (label: string): boolean => {
	return label.toLowerCase() === 'zns';
};

/**
 * Format a total amount of proposal metadata
 * @param tokenMetaData to format
 * @returns formatted total ammount of proposal metadata
 */
export const formatTotalAmountOfTokenMetadata = (
	tokenMetaData: TokenMetaData,
): string => {
	const { amount, decimals } = tokenMetaData;

	return millify(Number(formatUnits(amount, decimals)), {
		precision: MILLIFY_PRECISION,
		lowercase: MILLIFY_LOWERCASE,
	});
};
