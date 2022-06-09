//- Constants Imports
import { NETWORK, NETWORK_TITLE } from './CustomHead.constants';

//- Assets Imports
import wilderFaviconSml from '../../../assets/favicon-wilder-16x16.png';
import zeroFaviconSml from '../../../assets/favicon-zero-16x16.png';
import testerFaviconSml from '../../../assets/favicon-tester-16x16.png';
import wilderFaviconLrg from '../../../assets/favicon-wilder-32x32.png';
import zeroFaviconLrg from '../../../assets/favicon-zero-32x32.png';
import testerFaviconLrg from '../../../assets/favicon-tester-32x32.png';

export type HeadDataType = {
	network: string;
	title: string;
	iconSml: string;
	iconLrg: string;
};

export const NetworkHeadData = {
	zero: {
		network: NETWORK.DEFAULT,
		title: NETWORK_TITLE[NETWORK.DEFAULT],
		iconSml: zeroFaviconSml,
		iconLrg: zeroFaviconLrg,
	},
	wilder: {
		network: NETWORK.WILDER,
		title: NETWORK_TITLE[NETWORK.WILDER],
		iconSml: wilderFaviconSml,
		iconLrg: wilderFaviconLrg,
	},
	tester: {
		network: NETWORK.TESTER,
		title: NETWORK_TITLE[NETWORK.TESTER],
		iconSml: testerFaviconSml,
		iconLrg: testerFaviconLrg,
	},
};

export const getHeadData = (zna: string) => {
	if (
		zna.includes(NetworkHeadData.tester.network) ||
		process.env.REACT_APP_NETWORK === NetworkHeadData.tester.network
	) {
		return NetworkHeadData.tester;
	} else if (
		zna.includes(NetworkHeadData.wilder.network) ||
		process.env.REACT_APP_NETWORK === NetworkHeadData.wilder.network
	) {
		return NetworkHeadData.wilder;
	} else {
		return NetworkHeadData.zero;
	}
};
