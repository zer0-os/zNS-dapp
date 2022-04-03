//- Library Imports
import { Maybe } from 'lib/types';

//- Constants Imports
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

export const getBidToHighWarning = (
	isLoading: boolean,
	bid: string,
	wildBalance: number,
) => {
	let bidTooHighWarning: Maybe<React.ReactFragment> = null;

	if (!isLoading && Number(bid) > wildBalance!) {
		bidTooHighWarning = (
			<>
				<p className={styles.Error}>{ERRORS.INSUFFICIENT_FUNDS}</p>
			</>
		);
	}
	return bidTooHighWarning;
};
