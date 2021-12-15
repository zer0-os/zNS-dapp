import { StatsWidget } from 'components';
import { StakePoolTable } from 'containers/staking';
import { useEffect } from 'react';
import styles from './StakePools.module.scss';

import { useStaking } from 'lib/providers/staking/StakingProvider';

const StakePools = () => {
	const { pools } = useStaking();

	useEffect(() => {
		let isMounted = true;
		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<>
			<ul className={styles.Stats}>
				<StatsWidget
					className="normalView"
					fieldName={'Total Amount Staked'}
					isLoading={false}
					title={'-'}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'Rewards Issued'}
					isLoading={false}
					title={'-'}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'# Of People Staking'}
					isLoading={false}
					title={'-'}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'# Of Pools'}
					isLoading={pools === undefined}
					title={pools?.length}
				/>
			</ul>
			<StakePoolTable />
		</>
	);
};

export default StakePools;
