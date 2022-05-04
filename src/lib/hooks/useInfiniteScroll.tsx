import { useState, useMemo, useCallback } from 'react';
import { useInView } from 'react-intersection-observer';
import { useInterval } from './useInterval';

const INVIEW_CHECK_INTERVAL_DURATION = 1000; // mmilliseconds

export const useInfiniteScroll = (collection: any[], perPage = 10) => {
	const [page, setPage] = useState<number>(1);
	const { ref, inView } = useInView({ initialInView: true });

	const { data, hasMore } = useMemo(() => {
		return {
			data: collection.slice(0, page * perPage),
			hasMore: Math.ceil(collection.length / perPage) > page,
		};
	}, [collection, perPage, page]);

	const reset = useCallback(() => {
		return setPage(1);
	}, [setPage]);

	useInterval(
		() => {
			if (inView && hasMore) {
				setPage(page + 1);
			}
		},
		// Delay in milliseconds or null to stop it
		inView && hasMore ? INVIEW_CHECK_INTERVAL_DURATION : null,
	);

	return {
		ref,
		data,
		hasMore,
		reset,
	};
};

export default useInfiniteScroll;
