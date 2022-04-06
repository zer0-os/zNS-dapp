import { Detail, Spinner } from 'components';
import { ROUTES } from 'constants/routes';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import React from 'react';
import { useHistory } from 'react-router-dom';
import useAssets from '../../DAOPage/hooks/useAssets';
import { useTotals } from '../TotalProvider';

import defaultDaoIcon from 'assets/default_dao.png';
import { toFiat } from 'lib/currency';

import styles from './DAOTableCard.module.scss';
import ImageCard from 'components/Cards/ImageCard/ImageCard';

import { DAOTableDataItem } from './DAOTable.types';

type DAOTableCardProps = {
	data: DAOTableDataItem;
};

const DAOTableCard: React.FC<DAOTableCardProps> = ({ data }) => {
	// Data
	const { title, zna, dao } = data;

	// Hooks
	const history = useHistory();
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

	return (
		<ImageCard
			imageUri={dao.avatar ?? defaultDaoIcon}
			header={title}
			subHeader={zna && '0://' + zna}
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
