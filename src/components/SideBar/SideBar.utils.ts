//- Constants Imports
import { DOMAIN_LOGOS, ROOT_DOMAIN } from 'constants/domains';
import { ROUTES } from 'constants/routes';

export const getNetworkLogo = (zna: string, app: string) => {
	if (ROOT_DOMAIN !== 'wilder') {
		if (zna.startsWith('wilder')) {
			return DOMAIN_LOGOS.WILDER_WORLD;
		} else {
			return DOMAIN_LOGOS.ZERO;
		}
	} else {
		if (app === ROUTES.MARKET) {
			return DOMAIN_LOGOS.WILDER_WORLD;
		} else {
			return DOMAIN_LOGOS.ZERO;
		}
	}
};

export const getPriceWidget = (zna: string, app: string) => {
	if (ROOT_DOMAIN !== 'wilder') {
		return !zna.startsWith('wilder');
	} else {
		return app !== ROUTES.MARKET;
	}
};
