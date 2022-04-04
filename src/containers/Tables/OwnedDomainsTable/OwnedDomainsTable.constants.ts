import settingsIcon from './assets/settings.svg';
import dollarSignIcon from './assets/dollar-sign.svg';

export const HEADERS = [
	{
		label: 'Domain',
		accessor: '',
		className: 'domain',
	},
	{
		label: 'Top Bid (WILD)',
		accessor: '',
		className: '',
	},
	{
		label: '',
		accessor: '',
		className: '',
	},
];

export enum MESSAGES {
	LOADING = 'Loading Owned Domains',
}

export const ACTION_KEYS = {
	SETTINGS: 'Domain Settings',
	VIEW_BIDS: 'View Bids',
};

export const ACTIONS = [
	{
		icon: settingsIcon,
		title: ACTION_KEYS.SETTINGS,
	},
	{
		icon: dollarSignIcon,
		title: ACTION_KEYS.VIEW_BIDS,
	},
];
