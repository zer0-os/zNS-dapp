import { debounce } from 'lodash';

const DEFAULT_WAIT_MILLISECONDS = 250;

/**
 * Invokes callback on mouse clicking(s).
 * @param {Array} handlers - Array of clicking handlers.
 *
 */
export const useManyClickHandlers = (
	...handlers: Array<(e: React.UIEvent<HTMLElement>) => void>
) => {
	const callEventHandler = (e: React.UIEvent<HTMLElement>) => {
		if (e.detail <= 0) return;

		const handler = handlers[e.detail - 1];

		if (handler) {
			handler(e);
		}
	};

	const debounceHandler = debounce((e: React.UIEvent<HTMLElement>) => {
		callEventHandler(e);
	}, DEFAULT_WAIT_MILLISECONDS);

	return (e: React.UIEvent<HTMLElement>) => {
		e.persist();
		debounceHandler(e);
	};
};
