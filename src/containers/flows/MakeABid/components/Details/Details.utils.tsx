//- Constants Imports
import { replaceWildWithProperToken } from 'lib/utils';
import { ERRORS, getUsdEstimation } from '../../MakeABid.constants';

//- Styles Imports
import styles from './Details.module.scss';

export const getUsdFiatEstimation = (bidString: string, wildPrice?: number) => {
	if (!wildPrice) {
		return;
	}

	return (
		wildPrice > 0 && (
			<span className={styles.Estimate}>{getUsdEstimation(bidString)}</span>
		)
	);
};

export const getBidTooHighWarning = (
	isLoading: boolean,
	bid: string,
	tokenBalance: number,
	paymentTokenName: string,
) => {
	if (!isLoading && Number(bid) > tokenBalance!) {
		<p className={styles.Error}>
			{replaceWildWithProperToken(ERRORS.INSUFFICIENT_FUNDS, paymentTokenName)}
		</p>;
	}
};
