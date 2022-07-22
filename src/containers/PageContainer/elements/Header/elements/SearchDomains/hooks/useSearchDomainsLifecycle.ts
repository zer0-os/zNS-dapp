//- Library Imports
import { DomainSearch } from 'lib/hooks/useDomainSearch';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';

type UseSearchDomainsLifecycleProps = {
	props: {
		searchQuery: string;
	};
	domainSearch: DomainSearch;
	handlers: {
		handleDomainSearchPatternChange: () => void;
		handleSearchContainerHeightChange: () => void;
	};
};

export const useSearchDomainsLifecycle = ({
	props: { searchQuery },
	handlers: {
		handleDomainSearchPatternChange,
		handleSearchContainerHeightChange,
	},
	domainSearch,
}: UseSearchDomainsLifecycleProps) => {
	useUpdateEffect(handleDomainSearchPatternChange, [searchQuery]);

	useUpdateEffect(handleSearchContainerHeightChange, [
		searchQuery,
		domainSearch.matches,
	]);
};
