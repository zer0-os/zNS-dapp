// React
import React from 'react';

// Components
import DAOList from './pages/DAOList/DAOList';
import DAOPage from './pages/DAOPage/DAOPage';
import DAOCreate from './pages/DAOCreate/DAOCreate';

// Hooks
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useCurrentDao } from 'lib/dao/providers/CurrentDaoProvider';
import { useZdaoSdk } from 'lib/dao/providers/ZdaoSdkProvider';

// Lib
import { ROUTES } from 'constants/routes';

// Constants
import { DAO_CREATE } from 'lib/dao/constants';

// Style Imports
import styles from './DAOContainer.module.scss';
import classNames from 'classnames';
import useRedirect from 'lib/hooks/useRedirect';

type DAOContainerProps = {
	className?: string;
	style?: React.CSSProperties;
};

const DAOContainer: React.FC<DAOContainerProps> = ({ className, style }) => {
	const { redirect } = useRedirect();
	const { zna } = useCurrentDao();
	const { instance: sdk } = useZdaoSdk();

	/**
	 * Handle loading a DAO which does not exist
	 */
	useUpdateEffect(async () => {
		if (!sdk || !zna.length || zna === DAO_CREATE) {
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

	return (
		<main className={classNames(styles.Container, className)} style={style}>
			{zna === DAO_CREATE && <DAOCreate />}
			{zna === '' && <DAOList />}
			{zna !== DAO_CREATE && zna !== '' && <DAOPage />}
		</main>
	);
};

export default DAOContainer;
