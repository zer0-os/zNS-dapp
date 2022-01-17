import { useMemo, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
	getWildPriceUsdRequest,
	getLootPriceUsdRequest,
	getWildPricePercentageChangeRequest,
} from 'store/currency/actions';
import { getCurrency } from 'store/currency/selectors';
import { useDidMount } from './useDidMount';

export type CurrencyHook = {
	wildPriceUsd: number;
	lootPriceUsd: number;
	wildPercentageChange: number;
};

const useCurrency = (): CurrencyHook => {
	const currency = useSelector(getCurrency);

	const dispatch = useDispatch();

	const getWildPriceUsd = useCallback(() => {
		dispatch(getWildPriceUsdRequest());
	}, [dispatch]);

	const getLootPriceUsd = useCallback(() => {
		dispatch(getLootPriceUsdRequest());
	}, [dispatch]);

	const getWildPricePercentageChange = useCallback(() => {
		dispatch(getWildPricePercentageChangeRequest());
	}, [dispatch]);

	useDidMount(() => {
		getWildPriceUsd();
		getLootPriceUsd();
		getWildPricePercentageChange();
	});

	return useMemo(() => currency, [currency]);
};

export default useCurrency;
