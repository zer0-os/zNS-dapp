import { formatUnits } from 'ethers/lib/utils';
import { TokenMetaData } from '@zero-tech/zdao-sdk';
import { toFiat } from 'lib/currency';
import { secondsToDhms } from 'lib/utils/datetime';
import { DEFAULT_TIMMER_EXPIRED_LABEL } from './ProposalsTable.constants';

/**
 * Format a time diff as humanized string
 * @param timeDiff to format
 * @returns formatted humanized string
 */
export const formatProposalEndTime = (timeDiff: number): string => {
	if (timeDiff < 0) {
		return DEFAULT_TIMMER_EXPIRED_LABEL;
	}

	return secondsToDhms(timeDiff / 1000);
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
	tokenMetaData?: TokenMetaData,
	asNumber: boolean = false,
): string | number | null => {
	if (!tokenMetaData) return null;

	const { amount, decimals } = tokenMetaData;

	if (!amount || !decimals) return null;

	const amountInWILD = Math.min(
		Number(formatUnits(amount, decimals)),
		Number.MAX_SAFE_INTEGER,
	);

	if (asNumber) {
		return amountInWILD;
	}

	return toFiat(amountInWILD, {
		maximumFractionDigits: 2,
		minimumFractionDigits: 0,
	});
};

/**
 * Format a total amount in USD of proposal metadata
 * @param tokenMetaData to format
 * @returns formatted total ammount in USD of proposal metadata
 */
export const formatAmountInUSDOfTokenMetadata = (
	wildPriceUsd: number,
	tokenMetaData?: TokenMetaData,
): string | null => {
	const amountInWILD = formatTotalAmountOfTokenMetadata(tokenMetaData, true);

	if (!amountInWILD) return null;

	return '$' + toFiat(Number(amountInWILD) * wildPriceUsd);
};
