//- React Imports
import React from 'react';

//- Library Imports
import useAsyncEffect from 'use-async-effect';
import { useZnsSdk } from './sdk';

//- Utils Imports
import { getDomainId } from '../utils/domains';
import { filterSearchResultsByNetwork } from 'lib/utils/searchResults';

//- Types Imports
import { DisplayParentDomain, ParentDomain } from '../types';

export interface DomainSearch {
	exactMatch?: DisplayParentDomain;
	matches?: DisplayParentDomain[];
	setPattern: (pattern: string) => void;
}
export function useDomainSearch() {
	const { instance: sdk } = useZnsSdk();
	const [pattern, setPattern] = React.useState('');
	const [exactMatch, setExactMatch] = React.useState<
		DisplayParentDomain | undefined
	>(undefined);
	const [matches, setMatches] = React.useState<DisplayParentDomain[]>([]);
	useAsyncEffect(async () => {
		const id = getDomainId(pattern);
		if (id) {
			try {
				const rawDomain = await sdk.getDomainById(id, false);
				if (rawDomain) {
					const exactDomain = rawDomain as any;
					exactDomain.metadata = exactDomain.metadataUri;
					exactDomain.minter = { id: exactDomain.minter };
					exactDomain.owner = { id: exactDomain.owner };
					exactDomain.parent = { id: exactDomain.parentId };
					exactDomain.lockedBy = { id: exactDomain.lockedBy };
					delete exactDomain.parentId;
					let match: DisplayParentDomain | undefined = undefined;
					if (exactDomain) {
						match = {
							...exactDomain,
						} as DisplayParentDomain;
					}
					setExactMatch(match);
				}
			} catch (err) {
				// TODO: Handle it
				// console.log(err);
			}
		}
		try {
			const rawDomains = await sdk.getDomainsByName(pattern);
			let matchesResult: DisplayParentDomain[] = [];
			const fuzzyMatch = rawDomains.map((item) => {
				const domain = item as any;
				domain.metadata = domain.metadataUri;
				domain.minter = { id: domain.minter };
				domain.owner = { id: domain.owner };
				domain.parent = { id: domain.parentId };
				domain.lockedBy = { id: domain.lockedBy };
				return domain;
			});
			if (fuzzyMatch) {
				matchesResult = fuzzyMatch.map((e: ParentDomain) => {
					return { ...e } as DisplayParentDomain;
				});
			}

			// filter network specific search results
			const networkSearchResults = filterSearchResultsByNetwork(matchesResult);

			setMatches(networkSearchResults);
		} catch (err) {
			// TODO: Handle it
			console.log(err);
		}
	}, [pattern]);
	return {
		exactMatch,
		matches,
		setPattern,
	} as DomainSearch;
}
