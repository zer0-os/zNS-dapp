import { useHistory } from 'react-router-dom';
import { useUpdateEffect } from './useUpdateEffect';

/**
 * Invokes callback on React router changes.
 * @param {function} callback - A callback to invoke.
 */
export const useValidateRouteChanges = ({
	unblockCheckCallback,
	blockCallback,
}: {
	unblockCheckCallback: (pathname: string) => boolean;
	blockCallback: (pathname: string) => void;
}): void => {
	const history = useHistory();

	useUpdateEffect(() => {
		const unblock = history.block(({ pathname }) => {
			// if is form not changed we can allow the navigation
			if (unblockCheckCallback(pathname)) {
				// we can now unblock
				unblock();
				// proceed with the blocked navigation
				history.push(pathname);
			}
			// prevent navigation and somehow determine navigation when clicking discard
			blockCallback(pathname);

			return false;
		});

		// just in case theres an unmount we can unblock if it exists
		return unblock;
	}, [history, unblockCheckCallback, blockCallback]);
};
