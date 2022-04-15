//- Assets Imports
import settingsIcon from './assets/settings.svg';
import dollarSignIcon from './assets/dollar-sign.svg';

//- Constants Imports
import { ACTION_KEYS } from './OwnedDomainsTable.constants';

export const getActions = (isViewBids: boolean) => {
	const ACTIONS = [
		{
			icon: settingsIcon,
			title: ACTION_KEYS.SETTINGS,
		},
		{
			icon: dollarSignIcon,
			title: ACTION_KEYS.VIEW_BIDS,
		},
	];

	const filteredActions = ACTIONS.filter(
		(item) => item.title !== ACTION_KEYS.VIEW_BIDS,
	);

	const actions = isViewBids ? ACTIONS : filteredActions;

	return actions;
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
