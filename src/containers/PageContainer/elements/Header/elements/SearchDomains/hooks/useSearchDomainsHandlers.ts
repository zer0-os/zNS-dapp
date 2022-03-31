import React, { useCallback, useMemo } from 'react';
import { History } from 'history';
import { DomainSearch } from 'lib/useDomainSearch';
import { getRelativeDomainPath } from 'lib/utils/domains';
import { ROUTES } from 'constants/routes';
import {
	MIN_SEARCH_QUERY_LENGTH,
	DEFAULT_SEARCH_CONTAINER_PADDING,
	DEFAULT_SEARCH_CONTAINER_HEIGHT,
} from '../SearchDomains.constants';

type UseSearchDomainsHandlersProps = {
	props: {
		searchQuery: string;
	};
	domainSearch: DomainSearch;
	localActions: {
		setContainerHeight: React.Dispatch<React.SetStateAction<number>>;
	};
	listRef: React.RefObject<HTMLUListElement>;
	history: History<unknown>;
};

type UseSearchDomainsHandlersReturn = {
	handleDomainSearchPatternChange: () => void;
	handleSearchContainerHeightChange: () => void;
	handleDomainClick: (to: string) => () => void;
};

export const useSearchDomainsHandlers = ({
	props: { searchQuery },
	localActions,
	domainSearch,
	listRef,
	history,
}: UseSearchDomainsHandlersProps): UseSearchDomainsHandlersReturn => {
	const handleDomainSearchPatternChange = useCallback(() => {
		// If the query is valid, set the pattern
		// Else set the pattern to an invalid domain so it empties the search
		if (searchQuery.length >= MIN_SEARCH_QUERY_LENGTH) {
			domainSearch.setPattern(searchQuery);
		} else {
			domainSearch.setPattern('?');
		}
	}, [searchQuery, domainSearch]);

	const handleSearchContainerHeightChange = useCallback(() => {
		const searchContainerHeight =
			listRef?.current?.clientHeight || DEFAULT_SEARCH_CONTAINER_HEIGHT;

		localActions.setContainerHeight(
			searchContainerHeight + DEFAULT_SEARCH_CONTAINER_PADDING,
		);

		if (searchQuery.length === 0) localActions.setContainerHeight(0);

		return () => {
			localActions.setContainerHeight(DEFAULT_SEARCH_CONTAINER_HEIGHT);
		};
	}, [searchQuery, localActions, listRef]);

	const handleDomainClick = useCallback(
		(to: string) => () => {
			const relativeDomain = getRelativeDomainPath(to);

			history.push(`${ROUTES.MARKET}/${relativeDomain}`);
		},
		[history],
	);

	return useMemo(
		() => ({
			handleDomainSearchPatternChange,
			handleSearchContainerHeightChange,
			handleDomainClick,
		}),
		[
			handleDomainSearchPatternChange,
			handleSearchContainerHeightChange,
			handleDomainClick,
		],
	);
};
