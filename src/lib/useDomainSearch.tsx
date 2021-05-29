import React from 'react';
import { getDomainId, rootDomainName } from './domains';
import { DisplayParentDomain, ParentDomain } from './types';
import {
	useQueryDomainsNameContain,
	useQueryForDomainById,
} from './useDomainStore';

interface DomainSearch {
	exactMatch?: DisplayParentDomain;
	matches?: DisplayParentDomain[];
	setPattern: (pattern: string) => void;
}

export function useDomainSearch() {
	const [pattern, setPattern] = React.useState('');
	const [exactMatch, setExactMatch] =
		React.useState<DisplayParentDomain | undefined>(undefined);
	const [matches, setMatches] = React.useState<DisplayParentDomain[]>([]);

	const id = getDomainId(pattern);

	const { dataDomain: exactData } = useQueryForDomainById(id);

	// `id` is already relative but we need to search relative
	const { data: matchesData } = useQueryDomainsNameContain(
		`${rootDomainName}.%${pattern}`,
	);

	React.useEffect(() => {
		let exactMatch: DisplayParentDomain | undefined = undefined;

		if (exactData && exactData.domains) {
			exactMatch = {
				...exactData.domains[0],
			} as DisplayParentDomain;
		}

		setExactMatch(exactMatch);
	}, [exactData]);

	React.useEffect(() => {
		let matches: DisplayParentDomain[] = [];

		if (matchesData && matchesData.domains) {
			matches = matchesData.domains.map((e: ParentDomain) => {
				return { ...e } as DisplayParentDomain;
			});
		}

		setMatches(matches);
	}, [matchesData]);

	return {
		exactMatch,
		matches,
		setPattern,
	} as DomainSearch;
}
