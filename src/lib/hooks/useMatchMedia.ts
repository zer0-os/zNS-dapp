import { useState, useEffect } from 'react';

const mediaQueries = {
	phone: '(min-width: 320px) and (max-width: 568px)',
	tablet: '(min-width : 768px) and (max-width : 1024px)',
	desktop: '(min-width : 1224px)',
};

const useMatchMedia = (query: any) => {
	if (typeof window !== 'object') return;
	if (!window.matchMedia) return;

	const queryToMatch =
		mediaQueries[query as keyof typeof mediaQueries] || query;
	// eslint-disable-next-line react-hooks/rules-of-hooks
	const [matches, setMatches] = useState(
		window.matchMedia(queryToMatch).matches,
	);

	// eslint-disable-next-line react-hooks/rules-of-hooks
	useEffect(() => {
		const media = window.matchMedia(queryToMatch);

		if (media.matches !== matches) setMatches(media.matches);

		const listener = () => setMatches(media.matches);

		if (media.addEventListener) {
			media.addEventListener('change', listener);
		} else media.addListener(listener);

		return () =>
			media.removeEventListener
				? media.removeEventListener('change', listener)
				: media.removeListener(listener);
	}, [matches, queryToMatch]);

	return matches;
};
export default useMatchMedia;
