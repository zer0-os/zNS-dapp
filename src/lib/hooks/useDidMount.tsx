import { useEffect } from 'react';

/**
 * Invokes callback on React component mount.
 * @param {function} callback - A callback to invoke.
 */
export const useDidMount = (callback: () => void) => {
	useEffect(() => {
		callback();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
};
