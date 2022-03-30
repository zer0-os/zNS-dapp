// React
import React from 'react';
import { Switch } from 'react-router-dom';

// Components
import DAOList from './pages/DAOList/DAOList';
import DAOPage from './pages/DAOPage/DAOPage';

// Hooks
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useCurrentDao } from 'lib/dao/providers/CurrentDaoProvider';
import { useZdaoSdk } from 'lib/dao/providers/ZdaoSdkProvider';
import { useNavbar } from 'lib/hooks/useNavbar';
import { useDidMount } from 'lib/hooks/useDidMount';

// Lib
import { ROUTES } from 'constants/routes';

// Style Imports
import styles from './DAOContainer.module.scss';
import classNames from 'classnames';
import useRedirect from 'lib/hooks/useRedirect';

type StakingContainerProps = {
	className?: string;
	style?: React.CSSProperties;
};

const DAOContainer: React.FC<StakingContainerProps> = ({
	className,
	style,
}) => {
	const { redirect } = useRedirect();
	const { setNavbarTitle } = useNavbar();
	const { zna } = useCurrentDao();
	const { instance: sdk } = useZdaoSdk();

	/**
	 * Handle loading a DAO which does not exist
	 */
	useUpdateEffect(async () => {
		if (!sdk || !zna.length) {
			return;
		}

		try {
			const exists: boolean = await sdk.doesZDAOExist(zna);

			if (!exists) {
				redirect(ROUTES.ZDAO, 'Could not find a DAO for ' + zna);
			}
		} catch (e) {
			console.error(e);
		}
	}, [sdk, zna]);

	useDidMount(setNavbarTitle);

	return (
		<Switch>
			<main className={classNames(styles.Container, className)} style={style}>
				{zna === '' ? <DAOList /> : <DAOPage />}
			</main>
		</Switch>
	);
};

export default DAOContainer;
