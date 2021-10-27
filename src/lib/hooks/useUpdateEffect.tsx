import { useEffect, useRef } from 'react';

/**
 * A custom useEffect hook that only triggers on updates, not on initial mount
 * @param {Function} callback
 * @param {Array<any>} dependencies
 */
export const useUpdateEffect = (
	callback: React.EffectCallback,
	dependencies: React.DependencyList = [],
) => {
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
