//- Library Imports
import { Domain } from '@zero-tech/zns-sdk';
import { Option } from 'components/Dropdowns/OptionDropdown/OptionDropdown';

//- Assets Imports
import { Box, Send, Tag } from 'react-feather';
import { DollarSign } from 'react-feather';

//- Constants Imports
import { ACTION_KEYS } from './OwnedDomainsTable.constants';

export const getActions = (isViewBids: boolean): Option[] => {
	const ACTIONS = [
		{
			icon: <DollarSign />,
			title: ACTION_KEYS.VIEW_BIDS,
		},
		{
			icon: <Tag />,
			title: ACTION_KEYS.SET_BUY_NOW,
		},
		{
			icon: <Send />,
			title: ACTION_KEYS.TRANSFER_OWNERSHIP,
		},
		{
			icon: <Box />,
			title: ACTION_KEYS.SETTINGS,
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
		icon: <DollarSign />,
		title: ACTION_KEYS.VIEW_BIDS,
	},
	{
		icon: <Tag />,
		title: ACTION_KEYS.SET_BUY_NOW,
	},
	{
		icon: <Send />,
		title: ACTION_KEYS.TRANSFER_OWNERSHIP,
	},
	{
		icon: <Box />,
		title: ACTION_KEYS.SETTINGS,
	},
];

export const filterOwnedDomainsByNetwork = (domains?: Domain[]) => {
	if (!domains) {
		return domains;
	} else if ((process.env.REACT_APP_NETWORK ?? '') === '') {
		return domains;
	} else {
		const onNetworkOwnedDomains = domains?.filter(
			(domain) => domain.name.split('.')[0] === process.env.REACT_APP_NETWORK,
		);
		return onNetworkOwnedDomains;
	}
};
