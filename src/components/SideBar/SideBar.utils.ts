//- Constants Imports
import { DOMAIN_LOGOS, ROOT_DOMAIN } from 'constants/domains';

export const getNetworkLogo = (zna: string, app: string) => {
	if (ROOT_DOMAIN === 'wilder') {
		return DOMAIN_LOGOS.WILDER_WORLD;
	}

	if (zna.startsWith('wilder')) {
		return DOMAIN_LOGOS.WILDER_WORLD;
	} else {
		return DOMAIN_LOGOS.ZERO;
	}
};

export const getPriceWidget = (zna: string) => {
	if (ROOT_DOMAIN !== 'wilder') {
		return zna.startsWith('wilder');
	}
	return true;
};
