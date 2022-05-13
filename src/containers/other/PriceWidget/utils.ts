// -Icon Imports
import uniSwapLogo from 'assets/uni-swap-logo.png';
import kucoinLogo from 'assets/kucoin-logo.png';
import gateioLogo from 'assets/gateio-logo.png';

// -Constants Imports
import { TITLES } from './constants';
import { URLS } from 'constants/urls';

// Row Data
export const WildUrlRowData = [
	{
		title: TITLES.UNI_SWAP,
		href: URLS.UNI_SWAP_WILD,
		src: uniSwapLogo,
	},
	{
		title: TITLES.KUCOIN,
		href: URLS.KUCOIN,
		src: kucoinLogo,
	},
	{
		title: TITLES.GATEIO,
		href: URLS.GATEIO,
		src: gateioLogo,
	},
];

export const ZeroUrlRowData = [
	{
		title: TITLES.UNI_SWAP,
		href: URLS.UNI_SWAP_ZERO,
		src: uniSwapLogo,
	},
];

//- Enums
export enum Size {
	LRG = 'LRG',
	SML = 'SML',
}

export type urlRowDataType = { title: string; href: string; src: string }[];

export type TokenType = {
	tokenPrice: number;
	percentageChange: number;
	tokenTitle: string;
	urlList: urlRowDataType | undefined;
	urlCMC: string;
	dividerCopy: string;
};
