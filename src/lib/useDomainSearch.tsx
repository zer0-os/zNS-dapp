import React from 'react';
import { getDomainId, rootDomainName } from './utils/domains';
import { DisplayParentDomain, ParentDomain } from './types';
import useAsyncEffect from 'use-async-effect';
import { useZnsSdk } from './hooks/sdk';

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
		try {
			const rawDomain = await sdk.getDomainById(id);
			const exactDomain = rawDomain as any;
			exactDomain.metadata = exactDomain.metadataUri;
			exactDomain.minter = { id: exactDomain.minter };
			exactDomain.owner = { id: exactDomain.owner };
			exactDomain.parent = { id: exactDomain.parentId };
			exactDomain.lockedBy = { id: exactDomain.lockedBy };

			delete exactDomain.parentId;

			let exactMatch: DisplayParentDomain | undefined = undefined;

			if (exactDomain) {
				exactMatch = {
					...exactDomain,
				} as DisplayParentDomain;
			}
			setExactMatch(exactMatch);

			const rawDomains = await sdk.getDomainsByName(
				`${rootDomainName}.%${pattern}`,
			);

			let matches: DisplayParentDomain[] = [];
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
				matches = fuzzyMatch.map((e: ParentDomain) => {
					return { ...e } as DisplayParentDomain;
				});
			}
			setMatches(matches);
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
