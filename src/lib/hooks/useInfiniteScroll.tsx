import { useState, useCallback, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
const DEFAULT_PER_PAGE = 10;

export const useInfiniteScroll = (
	total: number,
	perPage: number = DEFAULT_PER_PAGE,
) => {
	const [page, setPage] = useState<number>(1);
	const { ref, inView } = useInView({
		initialInView: true,
		rootMargin: '100% 0px',
	});
	const hasMore = Math.ceil(total / perPage) > page;

	const reset = useCallback(() => {
		return setPage(1);
	}, [setPage]);

	useEffect(() => {
		if (inView && hasMore) {
			setPage((page) => page + 1);
		}
	}, [inView, hasMore]);

	return {
		ref,
		page,
		hasMore,
		reset,
	};
};

export default useInfiniteScroll;
