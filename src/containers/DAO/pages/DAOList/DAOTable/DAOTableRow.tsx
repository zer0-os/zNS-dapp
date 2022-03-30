// React
import { useState } from 'react';
import { useHistory } from 'react-router-dom';

// Components
import { Artwork, Spinner } from 'components';

// Hooks
import { useZdaoSdk } from 'lib/dao/providers/ZdaoSdkProvider';
import { useDidMount } from 'lib/hooks/useDidMount';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import useAssets from '../../DAOPage/hooks/useAssets';
import { useTotals } from '../TotalProvider';

// Lib
import { zDAO } from '@zero-tech/zdao-sdk';
import { toFiat } from 'lib/currency';
import { ROUTES } from 'constants/routes';

// Styles
import styles from './DAOTableRow.module.scss';

import defaultDaoIcon from 'assets/default_dao.png';

/**
 * Defines a single row in a DAO table
 */
const DAOTableRow = (props: any) => {
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
	const onClickRow = () => {
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
	const getData = async () => {
		setDao(undefined);
		if (!sdk || !zna) {
			return;
		}
		try {
			const zDao: zDAO = await sdk.getZDAOByZNA(zna);
			setDao(zDao);
		} catch (e) {
			console.error(e);
		}
	};

	// Lifecycle
	useDidMount(getData);
	useUpdateEffect(getData, [zna, sdk]);

	return (
		<tr className={styles.Container} onClick={onClickRow}>
			<td>
				<Artwork
					id={'1'}
					domain={zna}
					name={dao?.title}
					image={dao?.avatar ?? defaultDaoIcon}
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
