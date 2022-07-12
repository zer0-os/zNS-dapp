//- Library Improts
import { ROOT_DOMAIN } from 'constants/domains';
import { DisplayParentDomain } from 'lib/types';

export const filterSearchResultsByNetwork = (
	results: DisplayParentDomain[],
) => {
	if (results && ROOT_DOMAIN) {
		return results.filter((r) => r.name.startsWith(ROOT_DOMAIN + '.'));
	}
	return results;
};
