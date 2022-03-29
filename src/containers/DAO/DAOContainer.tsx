// React
import React from 'react';
import { Switch, useHistory } from 'react-router-dom';

// Components
import DAOList from './pages/DAOList/DAOList';
import DAOPage from './pages/DAOPage/DAOPage';

// Hooks
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useCurrentDao } from 'lib/dao/providers/CurrentDaoProvider';
import useNotification from 'lib/hooks/useNotification';
import { useZdaoSdk } from 'lib/dao/providers/ZdaoSdkProvider';
import { useNavbar } from 'lib/hooks/useNavbar';
import { useDidMount } from 'lib/hooks/useDidMount';

// Lib
import { ROUTES } from 'constants/routes';

// Style Imports
import styles from './DAOContainer.module.scss';
import classNames from 'classnames';

type StakingContainerProps = {
	className?: string;
	style?: React.CSSProperties;
};

const DAOContainer: React.FC<StakingContainerProps> = ({
	className,
	style,
}) => {
	const history = useHistory();
	const { setNavbarTitle } = useNavbar();
	const { addNotification } = useNotification();
	const { dao, isLoading, zna } = useCurrentDao();
	const { instance: sdk } = useZdaoSdk();

	/**
	 * Handle loading a DAO which does not exist
	 */
	useUpdateEffect(() => {
		if (sdk && !isLoading && zna.length > 0 && !dao) {
			addNotification(`Could not find a DAO at ${zna} - redirected home`);
			history.replace(ROUTES.ZDAO);
		}
	}, [isLoading, sdk]);

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
