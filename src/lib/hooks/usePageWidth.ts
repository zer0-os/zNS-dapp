import { useState, useCallback } from 'react';
import { useDidMount } from 'lib/hooks/useDidMount';
import { useWillUnmount } from 'lib/hooks/useWillUnmount';

type UsePageWidthReturn = {
	pageWidth: number;
};

export const usePageWidth = (): UsePageWidthReturn => {
	const [pageWidth, setPageWidth] = useState<number>(0);

	const handleResize = useCallback(() => {
		setPageWidth(window.innerWidth);
	}, [setPageWidth]);

	useDidMount(() => {
		window.addEventListener('resize', handleResize);
		handleResize();
	});

	useWillUnmount(() => {
		window.removeEventListener('resize', handleResize);
	});

	return { pageWidth };
};

export default usePageWidth;
