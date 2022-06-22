// React
import React, { useEffect, useState } from 'react';

// Components
import { StatsWidget } from 'components';
import DAOTable from './DAOTable/DAOTable';

// Hooks
import { useZdaoSdk } from 'lib/dao/providers/ZdaoSdkProvider';
import { useTotals, TotalsProvider } from './TotalProvider';

// Lib
import { toFiat } from 'lib/currency';

// Styles
import classNames from 'classnames';
import genericStyles from '../Container.module.scss';
import { useNavbar } from 'lib/hooks/useNavbar';
import { useDidMount } from 'lib/hooks/useDidMount';

const DAOList: React.FC = () => {
	const { instance: sdk } = useZdaoSdk();
	const { setNavbarTitle } = useNavbar();

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [daoZnas, setDaoZnas] = useState<string[] | undefined>();

	const { totals } = useTotals(); // totals from table rows

	useEffect(() => {
		let isMounted = true;
		if (sdk) {
			setIsLoading(true);
			try {
				sdk.listZNAs().then((z) => {
					if (isMounted) {
						/**
						 * 06/17/2022 Noted
						 * For MVP, we would like to hide 'wilder' zna
						 */
						setDaoZnas(z.filter((zna) => zna.startsWith('wilder.')));
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
