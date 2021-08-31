import React from 'react';
import { getDomainId, rootDomainName } from './utils/domains';
import { DisplayParentDomain, ParentDomain } from './types';
import {
	useDomainByIdQuery,
	useDomainsByNameContainsQuery,
} from './hooks/zNSDomainHooks';
import useNotification from './hooks/useNotification';

interface DomainSearch {
	exactMatch?: DisplayParentDomain;
	matches?: DisplayParentDomain[];
	setPattern: (pattern: string) => void;
}

export function useDomainSearch() {
	const [pattern, setPattern] = React.useState('');
	const [exactMatch, setExactMatch] = React.useState<
		DisplayParentDomain | undefined
	>(undefined);
	const [matches, setMatches] = React.useState<DisplayParentDomain[]>([]);

	const id = getDomainId(pattern);

	const byIdQuery = useDomainByIdQuery(id);
	const exactDomain = byIdQuery.data;

	// `id` is already relative but we need to search relative
	const byNameContainsQuery = useDomainsByNameContainsQuery(
		`${rootDomainName}.%${pattern}`,
	);
	const fuzzyMatch = byNameContainsQuery.data;
	const { addNotification } = useNotification();
	const [displayedLoadError, setDisplayedLoadError] = React.useState(false);
	if ((byIdQuery.error || byNameContainsQuery.error) && !displayedLoadError) {
		setDisplayedLoadError(true);
		addNotification(
			'One of our dependencies is experiencing an outage. Please visit later',
		);
	}

	React.useEffect(() => {
		let exactMatch: DisplayParentDomain | undefined = undefined;

		if (exactDomain && exactDomain.domain) {
			exactMatch = {
				...exactDomain.domain,
			} as DisplayParentDomain;
		}

		setExactMatch(exactMatch);
	}, [exactDomain]);

	React.useEffect(() => {
		let matches: DisplayParentDomain[] = [];

		if (fuzzyMatch && fuzzyMatch.domains) {
			matches = fuzzyMatch.domains.map((e: ParentDomain) => {
				return { ...e } as DisplayParentDomain;
			});
		}

		setMatches(matches);
	}, [fuzzyMatch]);

	return {
		exactMatch,
		matches,
		setPattern,
	} as DomainSearch;
}
