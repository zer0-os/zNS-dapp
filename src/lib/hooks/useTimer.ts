import moment from 'moment';
import { useState } from 'react';
import { useInterval } from './useInterval';

const DEFAULT_INTERVAL = 1000; // mmilliseconds

export const useTimer = (
	startDate: Date,
	interval: number | null = DEFAULT_INTERVAL,
) => {
	const [time, setTime] = useState(moment(startDate).diff(moment()));

	useInterval(() => {
		setTime(moment(startDate).diff(moment()));
	}, interval);

	return {
		time,
	};
};

export default useTimer;
