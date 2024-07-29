//- Routes Imports
import { ROUTES } from '../../constants/routes';
import { DAOIcon, ProfileIcon, StakingIcon } from 'components';

export const TITLES = {
	ZDAO: 'ZDAO',
	STAKING: 'STAKING',
	PROFILE: 'PROFILE',
};

export const getNavLinks = () => {
	const LINKS = [
		{
			label: 'DAOs',
			route: '/0.wilder' + ROUTES.ZDAO,
			icon: (stroke: string) => <DAOIcon title={TITLES.ZDAO} stroke={stroke} />,
		},
		{
			label: 'Staking',
			route: ROUTES.STAKING,
			icon: (stroke: string) => (
				<StakingIcon title={TITLES.STAKING} stroke={stroke} />
			),
		},
	];

	return LINKS;
};

export const getMobileNavLinks = () => {
	const LINKS = getNavLinks();
	const MOBILE_LINKS = [
		...LINKS,
		{
			label: 'Profile',
			route: ROUTES.PROFILE,
			icon: (stroke: string) => (
				<ProfileIcon title={TITLES.PROFILE} stroke={stroke} />
			),
		},
	];

	return MOBILE_LINKS;
};
