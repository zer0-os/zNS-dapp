//- Constants Imports
import { NETWORK, NETWORK_TITLE } from './CustomHead.constants';

export const NetworkHeadData = {
	zero: {
		network: NETWORK.DEFAULT,
		title: NETWORK_TITLE[NETWORK.DEFAULT],
		iconSml: '%PUBLIC_URL%/zero-favicon-32x32.png',
		iconLrg: '%PUBLIC_URL%/zero-favicon-32x32.png',
	},
	wilder: {
		network: NETWORK.WILDER,
		title: NETWORK_TITLE[NETWORK.WILDER],
		iconSml: '',
		iconLrg: '',
	},
	tester: {
		network: NETWORK.TESTER,
		title: NETWORK_TITLE[NETWORK.TESTER],
		iconSml: '',
		iconLrg: '',
	},
};

export const getHeadData = (zna: string) => {
	if (zna.includes(NetworkHeadData.tester.network)) {
		return NetworkHeadData.tester;
	} else if (zna.includes(NetworkHeadData.wilder.network)) {
		return NetworkHeadData.wilder;
	} else {
		return NetworkHeadData.zero;
	}
};
