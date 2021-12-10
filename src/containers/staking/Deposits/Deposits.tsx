import { StatsWidget } from 'components';
import { DepositTable } from 'containers/staking';
import { useEffect, useState } from 'react';
import styles from './Deposits.module.scss';

const Deposits = () => {
	const [wildBalance, setWildBalance] = useState<number | undefined>();
	const [totalStaked, setTotalStaked] = useState<number | undefined>();
	const [totalRewards, setTotalRewards] = useState<number | undefined>();
	const [totalRewardsVested, setTotalRewardsVested] = useState<
		number | undefined
	>();

	useEffect(() => {
		const getMetrics = async () => {
			await new Promise((r) => setTimeout(r, 3500));
			setWildBalance(1234);
			setTotalStaked(1295);
			setTotalRewards(112);
			setTotalRewardsVested(2);
		};
		getMetrics();
	}, []);

	return (
		<>
			<ul className={styles.Stats}>
				<StatsWidget
					className="normalView"
					fieldName={'Wallet WILD Balance'}
					isLoading={wildBalance === undefined}
					title={wildBalance?.toLocaleString() + ' WILD'}
					subTitle={`$${(1234.0).toLocaleString()}`}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'Total Stake'}
					isLoading={totalStaked === undefined}
					title={totalStaked?.toLocaleString() + ' WILD'}
					subTitle={`$${(1234.0).toLocaleString()}`}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'Total Rewards'}
					isLoading={totalRewards === undefined}
					title={totalRewards?.toLocaleString() + ' WILD'}
					subTitle={`$${(1234.0).toLocaleString()}`}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'Total Rewards Vested'}
					isLoading={totalRewardsVested === undefined}
					title={totalRewardsVested?.toLocaleString()}
					subTitle={`$${(1234.0).toLocaleString()}`}
				/>
			</ul>
			<DepositTable />
		</>
	);
};

export default Deposits;
