import marketIcon from 'assets/icon_market.svg';
import stakingIcon from 'assets/icon_staking.svg';
import daoIcon from 'assets/icon_dao.svg';

import { ROUTES } from './routes';

export const LINKS = [
	{
		label: 'Market',
		route: ROUTES.MARKET,
		icon: marketIcon,
	},
	{
		label: 'Staking',
		route: ROUTES.STAKING,
		icon: stakingIcon,
	},
	{
		label: 'DAO',
		route: ROUTES.ZDAO,
		icon: daoIcon,
	},
];
