import marketIcon from 'assets/icon_market.svg';
import stakingIcon from 'assets/icon_staking.svg';
import daoIcon from 'assets/icon_dao.svg';
import profileIcon from 'assets/profile-icon.svg';

import { ROUTES } from './routes';

export const LINKS = [
	{
		label: 'NFTs',
		route: ROUTES.MARKET,
		icon: marketIcon,
	},
	{
		label: 'DAOs',
		route: ROUTES.ZDAO,
		icon: daoIcon,
	},
	{
		label: 'Staking',
		route: ROUTES.STAKING,
		icon: stakingIcon,
	},
];

export const MOBILE_LINKS = [
	...LINKS,
	{ label: 'Profile', route: ROUTES.PROFILE, icon: profileIcon },
];
