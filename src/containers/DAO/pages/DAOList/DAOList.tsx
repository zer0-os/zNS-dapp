// React
import React, { useEffect, useState } from 'react';

// Components
import { StatsWidget } from 'components';
import DAOTable from './DAOTable/DAOTable';

// Hooks
import { useZdaoSdk } from 'lib/dao/providers/ZdaoSdkProvider';
import { TotalsProvider, useTotals } from './TotalProvider';

// Lib
import { toFiat } from 'lib/currency';

// Styles
import classNames from 'classnames';
import genericStyles from '../Container.module.scss';
import { useNavbar } from 'lib/hooks/useNavbar';
import { useDidMount } from 'lib/hooks/useDidMount';
import { ROOT_DOMAIN } from 'constants/domains';

const DAOList: React.FC = () => {
	const { instance: sdk } = useZdaoSdk();
	const { setNavbarTitle } = useNavbar();

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [daoZnas, setDaoZnas] = useState<string[] | undefined>();

	const { totals, isLoading: isTotalsDataLoading } = useTotals(); // totals from table rows

	useEffect(() => {
		let isMounted = true;
		if (sdk) {
			setIsLoading(true);
			try {
				sdk.listZNAs().then((z) => {
					if (isMounted) {
						setDaoZnas(
							z.filter(
								(zna) => zna.startsWith(ROOT_DOMAIN) && zna !== 'wilder',
							),
						);
						setIsLoading(false);
					}
				});
			} catch (e) {
				if (isMounted) {
					console.error(e);
					setIsLoading(false);
				}
			}
		}
		return () => {
			isMounted = false;
		};
	}, [sdk]);

	useDidMount(() => {
		setNavbarTitle('DAOs');
	});

	return (
		<div
			className={classNames(
				genericStyles.Container,
				'main',
				'background-primary',
			)}
		>
			<ul className={genericStyles.Stats}>
				<StatsWidget
					className="normalView"
					fieldName={'Total Value'}
					isLoading={isTotalsDataLoading}
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
			</ul>
			<DAOTable daoZnas={daoZnas} />
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
