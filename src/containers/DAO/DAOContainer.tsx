// React
import React, { useMemo, lazy, Suspense } from 'react';

// Hooks
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useCurrentDao } from 'lib/dao/providers/CurrentDaoProvider';
import { useZdaoSdk } from 'lib/dao/providers/ZdaoSdkProvider';

// Lib
import { ROUTES } from 'constants/routes';

// Constants
import { DAO_CREATE_PROPPAL } from 'lib/dao/constants';

// Style Imports
import styles from './DAOContainer.module.scss';
import classNames from 'classnames';
import useRedirect from 'lib/hooks/useRedirect';

// Components
import { LoadingIndicator } from 'components';
const DAOList = lazy(() => import('./pages/DAOList/DAOList'));
const DAOPage = lazy(() => import('./pages/DAOPage/DAOPage'));
const CreateProposal = lazy(
	() => import('./pages/CreateProposal/CreateProposal'),
);

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
		if (!sdk || !zna.length || zna === DAO_CREATE_PROPPAL) {
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

	const page = useMemo(() => {
		const isCreateProposal = zna === DAO_CREATE_PROPPAL;
		const isDAOList = zna === '';
		const isDAODetail = !isDAOList && !isCreateProposal;

		return {
			isCreateProposal,
			isDAOList,
			isDAODetail,
		};
	}, [zna]);

	return (
		<Suspense fallback={<LoadingIndicator text="" />}>
			<main className={classNames(styles.Container, className)} style={style}>
				{page.isCreateProposal && <CreateProposal />}
				{page.isDAOList && <DAOList />}
				{page.isDAODetail && zna !== '' && <DAOPage />}
			</main>
		</Suspense>
	);
};

export default DAOContainer;
