import { useEffect, useRef, EffectCallback, DependencyList } from 'react';

/**
 * A custom useEffect hook that only triggers on updates, not on initial mount
 * @param {Function} callback
 * @param {Array<any>} dependencies
 */
export const useUpdateEffect = (
	callback: EffectCallback | (() => void | Promise<void>),
	dependencies: DependencyList = [],
): void => {
	const isInitialMount = useRef(true);

	useEffect(() => {
		if (isInitialMount.current) {
			isInitialMount.current = false;
		} else {
			callback();
		}
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, dependencies);
};
