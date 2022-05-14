import { useEffect, useRef } from 'react';

export const useInterval = (callback: () => void, delay: number | null) => {
	const callbacRef = useRef(callback);

	// Remember the latest callback if it changes.
	useEffect(() => {
		callbacRef.current = callback;
	}, [callback]);

	// Set up the interval.
	useEffect(() => {
		// Don't schedule if no delay is specified.
		// Note: 0 is a valid value for delay.
		if (!delay || delay === 0) {
			return;
		}

		const id = setInterval(() => callbacRef.current(), delay);

		return () => clearInterval(id);
	}, [delay]);
};

export default useInterval;
