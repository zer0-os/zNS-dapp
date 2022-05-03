// React
import React from 'react';
import { useHistory } from 'react-router-dom';

// Components
import { Artwork, Spinner } from 'components';

// Hooks
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import useAssets from '../../DAOPage/hooks/useAssets';
import { useTotals } from '../TotalProvider';

// Lib
import { toFiat } from 'lib/currency';
import { ROUTES } from 'constants/routes';

// Styles
import styles from './DAOTableRow.module.scss';

import defaultDaoIcon from 'assets/default_dao.svg';

// Types
import { DAOTableDataItem } from './DAOTable.types';

type DAOTableRowProps = {
	data: DAOTableDataItem;
};

/**
 * Defines a single row in a DAO table
 */
const DAOTableRow: React.FC<DAOTableRowProps> = ({ data }) => {
	// Row Data
	const { title, zna, dao } = data;

	// Hooks
	const history = useHistory();
	const { add } = useTotals();
	const { totalUsd, isLoading: isLoadingAssets } = useAssets(dao);

	/**
	 * Navigates to the selected DAO zNA
	 */
	const onClickRow = () => {
		history.push(`${ROUTES.ZDAO}/${data.zna}/assets`);
	};

	/**
	 * Used to add to the DAO List total
	 */
	useUpdateEffect(() => {
		if (totalUsd) {
			add({ zna: data.zna, total: totalUsd });
		}
	}, [totalUsd]);

	return (
		<tr className={styles.Container} onClick={onClickRow}>
			<td>
				<Artwork
					id={dao.id}
					domain={'0://' + zna}
					name={title}
					image={defaultDaoIcon}
					disableInteraction
					disableAnimation
				/>
			</td>
			<td className={styles.Right}>
				{totalUsd !== undefined ? (
					'$' + toFiat(totalUsd!)
				) : isLoadingAssets ? (
					<Spinner />
				) : (
					'Failed to load'
				)}
			</td>
		</tr>
	);
};
export default DAOTableRow;
