import React, { useRef } from 'react';
import { useHistory } from 'react-router-dom';
import { Spring, animated } from 'react-spring';
import { useDomainSearch } from 'lib/useDomainSearch';
import {
	SEARCH_NOT_FOUND,
	IS_EXACT_MATCH_ENABLED,
} from './SearchDomains.constants';
import {
	useSearchDomainsData,
	useSearchDomainsHandlers,
	useSearchDomainsLifecycle,
} from './hooks';
import { getLastDomainName } from './SearchDomains.helpers';
import './_search-domains.scss';

type SearchDomainsProps = {
	searchQuery: string;
};

export const SearchDomains: React.FC<SearchDomainsProps> = ({
	searchQuery,
}) => {
	const listRef = useRef<HTMLUListElement>(null);
	const history = useHistory();
	const domainSearch = useDomainSearch();

	const { localState, localActions, formattedData } = useSearchDomainsData({
		props: { searchQuery },
		domainSearch,
	});

	const handlers = useSearchDomainsHandlers({
		props: { searchQuery },
		localActions,
		domainSearch,
		listRef,
		history,
	});

	useSearchDomainsLifecycle({
		props: { searchQuery },
		handlers,
		domainSearch,
	});

	return searchQuery ? (
		<Spring to={{ height: localState.containerHeight || 0 }}>
			{(animatedStyles) => (
				<animated.div
					className="search-domains__results background-primary"
					style={animatedStyles}
				>
					<div className="search-domains__results-content">
						<ul ref={listRef}>
							{IS_EXACT_MATCH_ENABLED && domainSearch?.exactMatch?.name && (
								<li
									className="exact__match"
									key={domainSearch.exactMatch.name}
									onMouseDown={handlers.handleDomainClick(
										domainSearch?.exactMatch?.name || '',
									)}
								>
									{getLastDomainName(domainSearch.exactMatch.name)}{' '}
									<span>{domainSearch.exactMatch.name}</span>
								</li>
							)}
							{domainSearch?.matches
								?.filter((d) => d.name.length > 1)
								.map((s, i) => (
									<li
										onMouseDown={handlers.handleDomainClick(s.name)}
										key={i + s.name}
									>
										{getLastDomainName(s.name)}
										<span>{s.name}</span>
									</li>
								))}

							{formattedData.isNotFound && (
								<li key={SEARCH_NOT_FOUND}>{SEARCH_NOT_FOUND}</li>
							)}
						</ul>
					</div>
				</animated.div>
			)}
		</Spring>
	) : null;
};
