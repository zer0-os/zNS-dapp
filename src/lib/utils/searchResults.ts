//- Library Improts
import { DisplayParentDomain } from 'lib/types';

export const filterSearchResultsByNetwork = (
	results: DisplayParentDomain[],
) => {
	if (!results) {
		return results;
	} else if ((process.env.REACT_APP_NETWORK ?? '') === '') {
		return results;
	} else {
		const onNetworkSearchResults = results?.filter(
			(result) => result.name.split('.')[0] === process.env.REACT_APP_NETWORK,
		);
		return onNetworkSearchResults;
	}
};
