import { useEffect, useRef } from 'react';

/**
 * Creates and returns reference to a value. The hook will update the reference if the values
 * will change. `usePrevious` is useful in situations when the value is used in some `useEffect`
 * but its change shouldn't trigger the effect.
 */
export const usePrevious = <T>(value: T): T => {
	const valueRef = useRef(value);

	useEffect(() => {
		valueRef.current = value;
	}, [value]);

	return valueRef.current;
};

export default usePrevious;
