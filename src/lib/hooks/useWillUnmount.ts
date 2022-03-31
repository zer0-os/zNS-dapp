import { useEffect } from 'react';

/**
 * A custom useEffect hook that only triggers when the component will unmount
 * @param {Function} callback
 */
export const useWillUnmount = (callback: () => void | undefined): void => {
	// eslint-disable-next-line react-hooks/exhaustive-deps
	useEffect(() => callback, []);
};
