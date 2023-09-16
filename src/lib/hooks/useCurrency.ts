import { useCallback, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
	getLootPriceUsdRequest,
	getWildPricePercentageChangeRequest,
	getWildPriceUsdRequest,
	getZeroPricePercentageChangeRequest,
	getZeroPriceUsdRequest,
} from 'store/currency/actions';
import { getCurrency } from 'store/currency/selectors';
import { useDidMount } from './useDidMount';

export type CurrencyHook = {
	wildPriceUsd: number;
	lootPriceUsd: number;
	zeroPriceUsd: number;
	wildPercentageChange: number;
	zeroPercentageChange: number;
};

const useCurrency = (refresh = true): CurrencyHook => {
	const currency = useSelector(getCurrency);

	const dispatch = useDispatch();

	const getWildPriceUsd = useCallback(() => {
		dispatch(getWildPriceUsdRequest());
	}, [dispatch]);

	const getLootPriceUsd = useCallback(() => {
		dispatch(getLootPriceUsdRequest());
	}, [dispatch]);

	const getZeroPriceUsd = useCallback(() => {
		dispatch(getZeroPriceUsdRequest());
	}, [dispatch]);

	const getWildPricePercentageChange = useCallback(() => {
		dispatch(getWildPricePercentageChangeRequest());
	}, [dispatch]);

	const getZeroPricePercentageChange = useCallback(() => {
		dispatch(getZeroPricePercentageChangeRequest());
	}, [dispatch]);

	useDidMount(() => {
		if (refresh) {
			getWildPriceUsd();
			getLootPriceUsd();
			getZeroPriceUsd();
			getWildPricePercentageChange();
			getZeroPricePercentageChange();
		}
	});

	return useMemo(() => currency, [currency]);
};

export default useCurrency;
