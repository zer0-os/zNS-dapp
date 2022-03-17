import React, { useState, useMemo } from 'react';
import { DomainSearch } from 'lib/useDomainSearch';

type UseSearchDomainsDataProps = {
	props: {
		searchQuery: string;
	};
	domainSearch: DomainSearch;
};

type UseSearchDomainsDataReturn = {
	localState: {
		containerHeight: number;
	};
	localActions: {
		setContainerHeight: React.Dispatch<React.SetStateAction<number>>;
	};
	formattedData: {
		isNotFound: boolean;
	};
};

export const useSearchDomainsData = ({
	props: { searchQuery },
	domainSearch,
}: UseSearchDomainsDataProps): UseSearchDomainsDataReturn => {
	const [containerHeight, setContainerHeight] = useState<number>(0);

	const isNotFound = useMemo(() => {
		return domainSearch?.matches?.length === 0 && searchQuery.length > 0;
	}, [searchQuery, domainSearch]);

	return {
		localState: { containerHeight },
		localActions: { setContainerHeight },
		formattedData: { isNotFound },
	};
};
