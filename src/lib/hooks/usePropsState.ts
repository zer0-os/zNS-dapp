import { useEffect, useState } from 'react';
import { isEqual } from 'lodash';
import usePrevious from './usePrevious';

/**
 * Same as useState, but will update itself value, when prop value is changed
 *
 * @param initial
 * @returns
 */
export const usePropsState = <T>(initial: T): [T, (v: T) => void] => {
	const [value, setValue] = useState<T>(initial);
	const prevInitial = usePrevious<T>(initial);

	const handleChangeValue = (v: T) => setValue(v);

	useEffect(() => {
		if (!isEqual(initial, prevInitial)) {
			setValue(initial);
		}
	}, [initial, prevInitial]);

	return [value, handleChangeValue];
};
