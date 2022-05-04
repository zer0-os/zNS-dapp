//- Assets Imports
import { Box } from 'react-feather';
import { DollarSign } from 'react-feather';

//- Constants Imports
import { ACTION_KEYS } from './OwnedDomainsTable.constants';

export const getActions = (isViewBids: boolean) => {
	const ACTIONS = [
		{
			icon: <Box />,
			title: ACTION_KEYS.SETTINGS,
		},
		{
			icon: <DollarSign />,
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
		icon: <Box />,
		title: ACTION_KEYS.SETTINGS,
	},
	{
		icon: <DollarSign />,
		title: ACTION_KEYS.VIEW_BIDS,
	},
];
