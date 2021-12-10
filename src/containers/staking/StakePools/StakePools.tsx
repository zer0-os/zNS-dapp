import { StatsWidget } from 'components';
import { StakePoolTable } from 'containers/staking';
import { useEffect, useState } from 'react';
import styles from './StakePools.module.scss';

const StakePools = () => {
	const [totalAmountStaked, setTotalAmountStaked] = useState<
		number | undefined
	>();
	const [rewardsIssued, setRewardsIssued] = useState<number | undefined>();
	const [numPeopleStaking, setNumPeopleStaking] = useState<
		number | undefined
	>();
	const [numPools, setNumPools] = useState<number | undefined>();

	useEffect(() => {
		const getMetrics = async () => {
			await new Promise((r) => setTimeout(r, 3500));
			setTotalAmountStaked(1234);
			setRewardsIssued(1295);
			setNumPeopleStaking(112);
			setNumPools(2);
		};
		getMetrics();
	}, []);

	return (
		<>
			<ul className={styles.Stats}>
				<StatsWidget
					className="normalView"
					fieldName={'Total Amount Staked'}
					isLoading={totalAmountStaked === undefined}
					title={totalAmountStaked?.toLocaleString() + ' WILD'}
					subTitle={`$${(1234.0).toLocaleString()}`}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'Rewards Issued'}
					isLoading={rewardsIssued === undefined}
					title={rewardsIssued?.toLocaleString() + ' WILD'}
					subTitle={`$${(1234.0).toLocaleString()}`}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'# Of People Staking'}
					isLoading={numPeopleStaking === undefined}
					title={numPeopleStaking?.toLocaleString() + ' WILD'}
					subTitle={`$${(1234.0).toLocaleString()}`}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'# Of Pools'}
					isLoading={numPools === undefined}
					title={numPools?.toLocaleString()}
					subTitle={`$${(1234.0).toLocaleString()}`}
				/>
			</ul>
			<StakePoolTable />
		</>
	);
};

export default StakePools;
