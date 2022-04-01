import { zDAO } from '@zero-tech/zdao-sdk';
import { Detail, Spinner } from 'components';
import { ROUTES } from 'constants/routes';
import { useZdaoSdk } from 'lib/dao/providers/ZdaoSdkProvider';
import { useDidMount } from 'lib/hooks/useDidMount';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useState } from 'react';
import { useHistory } from 'react-router-dom';
import useAssets from '../../DAOPage/hooks/useAssets';
import { useTotals } from '../TotalProvider';

import defaultDaoIcon from 'assets/default_dao.png';
import { toFiat } from 'lib/currency';

import styles from './DAOTableCard.module.scss';
import ImageCard from 'components/Cards/ImageCard/ImageCard';

const DAOTableCard = (props: any) => {
	// Data
	const { zna } = props.data;
	const [dao, setDao] = useState<zDAO | undefined>();

	// Hooks
	const history = useHistory();
	const { instance: sdk } = useZdaoSdk();
	const { add } = useTotals();
	const { totalUsd, isLoading: isLoadingAssets } = useAssets(dao);

	/**
	 * Navigates to the selected DAO zNA
	 */
	const onClick = () => {
		history.push(`${ROUTES.ZDAO}/${zna}/assets`);
	};

	/**
	 * Used to add to the DAO List total
	 */
	useUpdateEffect(() => {
		if (totalUsd) {
			add({ zna: zna, total: totalUsd });
		}
	}, [totalUsd]);

	/**
	 * Gets all DAO data, and stores it in state
	 */
	const getData = (): void => {
		setDao(undefined);
		if (!sdk || !zna) {
			return;
		}
		try {
			sdk.getZDAOByZNA(zna).then(setDao);
		} catch (e) {
			console.error(e);
		}
	};

	// Lifecycle
	useDidMount(getData);
	useUpdateEffect(getData, [zna, sdk]);

	return (
		<ImageCard
			imageUri={dao?.avatar ?? defaultDaoIcon}
			header={dao?.title}
			subHeader={zna && '0://wilder.' + zna}
			onClick={onClick}
		>
			<Detail
				className={styles.Total}
				text={
					isLoadingAssets ? (
						<Spinner />
					) : totalUsd === undefined ? (
						'Failed to retrieve'
					) : (
						'$' + toFiat(totalUsd!)
					)
				}
				subtext={'Total Value'}
			/>
		</ImageCard>
	);
};

export default DAOTableCard;
