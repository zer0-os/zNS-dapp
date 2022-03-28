// React
import { useState } from 'react';

// Components
import { StatsWidget } from 'components';
import DAOTable from './DAOTable/DAOTable';

// Hooks
import { useZdaoSdk } from 'lib/dao/providers/ZdaoSdkProvider';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useDidMount } from 'lib/hooks/useDidMount';
import { useTotals, TotalsProvider } from './TotalProvider';

// Lib
import { toFiat } from 'lib/currency';

// Styles
import classNames from 'classnames';
import genericStyles from '../Container.module.scss';

const DAOList = () => {
	const { instance: sdk } = useZdaoSdk();

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [daoZnas, setDaoZnas] = useState<string[] | undefined>();

	const { totals } = useTotals(); // totals from table rows

	/**
	 * Gets list for zNAs for current
	 */
	const getZnas = () => {
		if (sdk) {
			setIsLoading(true);
			sdk
				.listZDAOs()
				.then(setDaoZnas)
				.catch((e) => {
					console.error(e);
					console.warn('failed');
				})
				.finally(() => setIsLoading(false));
		}
	};

	// Lifecycle
	useUpdateEffect(getZnas, [sdk]);
	useDidMount(getZnas);

	return (
		<div
			className={classNames(
				genericStyles.Container,
				'main',
				'background-primary',
				'border-primary',
				'border-rounded',
			)}
		>
			<ul className={genericStyles.Stats}>
				<StatsWidget
					className="normalView"
					fieldName={'Total Value'}
					title={
						'$' + toFiat(totals.map((t) => t.total).reduce((a, b) => a + b, 0))
					}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'DAOs'}
					isLoading={isLoading}
					title={daoZnas?.length ?? 'Failed to find DAOs'}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'WILD Holders'}
					isLoading={false}
					title={'TO IMPLEMENT'}
				/>
			</ul>
			<DAOTable daoZnas={daoZnas} isLoading={false} />
		</div>
	);
};

/**
 * Defines the DAO List view
 */
const Wrap = () => {
	// This is wrapped in TotalsProvider so we can pass
	// asset totals up from table rows to the stat cards
	return (
		<TotalsProvider>
			<DAOList />
		</TotalsProvider>
	);
};

export default Wrap;
