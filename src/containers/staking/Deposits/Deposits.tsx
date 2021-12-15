import { useWeb3React } from '@web3-react/core';
import { StatsWidget } from 'components';
import { DepositTable } from 'containers/staking';
import { ethers } from 'ethers';
import { useStaking } from 'lib/providers/staking/StakingProvider';
import { useEffect, useState } from 'react';
import styles from './Deposits.module.scss';

const Deposits = () => {
	const { totalUserValueLocked, totalUserValueUnlocked, wildBalance } =
		useStaking();
	const { active } = useWeb3React();

	const [totalStaked, setTotalStaked] = useState<number | undefined>();
	const [totalRewards, setTotalRewards] = useState<number | undefined>();
	const [totalRewardsVested, setTotalRewardsVested] = useState<
		number | undefined
	>();

	useEffect(() => {
		let isMounted = true;
		const getMetrics = async () => {
			await new Promise((r) => setTimeout(r, 3500));
			if (isMounted) {
				setTotalStaked(1295);
				setTotalRewards(112);
				setTotalRewardsVested(2);
			}
		};
		getMetrics();
		return () => {
			isMounted = false;
		};
	}, []);

	return (
		<>
			<ul className={styles.Stats}>
				<StatsWidget
					className="normalView"
					fieldName={'Wallet WILD Balance'}
					isLoading={active && wildBalance === undefined}
					title={
						active && wildBalance !== undefined
							? Number(
									ethers.utils.formatEther(wildBalance.toString()),
							  ).toFixed(2) + ' WILD'
							: '-'
					}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'Total Stake'}
					isLoading={false}
					title={'????'}
					subTitle={'cant show multiple tokens'}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'Total Rewards'}
					isLoading={active && totalUserValueUnlocked === undefined}
					title={
						active
							? totalUserValueUnlocked?.toString().toLocaleString() + ' WILD'
							: '-'
					}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'Total Rewards Vested'}
					isLoading={active && totalUserValueLocked === undefined}
					title={
						active
							? totalUserValueLocked?.toString().toLocaleString() + ' WILD'
							: '-'
					}
				/>
			</ul>
			<DepositTable />
		</>
	);
};

export default Deposits;
