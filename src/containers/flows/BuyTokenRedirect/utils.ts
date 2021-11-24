// -Icon Imports
import uniSwapLogo from 'assets/uni-swap-logo.png';
import kucoinLogo from 'assets/kucoin-logo.png';
import gateioLogo from 'assets/gateio-logo.png';

// -Constants Imports
import * as constants from './constants';

// Row Data
export const UrlList = [
	{
		title: constants.UNI_SWAP_TITLE,
		href: constants.UNI_SWAP_URL,
		src: uniSwapLogo,
	},
	{
		title: constants.KUCOIN_TITLE,
		href: constants.KUCOIN_URL,
		src: kucoinLogo,
	},
	{
		title: constants.GATEIO_TITLE,
		href: constants.GATEIO_URL,
		src: gateioLogo,
	},
];

//- Enums
export enum Size {
	LRG = 'LRG',
	SML = 'SML',
}
