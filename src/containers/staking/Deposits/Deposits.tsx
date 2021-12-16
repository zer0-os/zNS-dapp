import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { StatsWidget } from 'components';
import { DepositTable } from 'containers/staking';
import { ethers } from 'ethers';
import { useZnsContracts } from 'lib/contracts';
import { displayEther, displayEtherToFiat, toFiat } from 'lib/currency';
import useCurrency from 'lib/hooks/useCurrency';
import { useStaking } from 'lib/providers/staking/StakingSDKProvider';
import { MaybeUndefined } from 'lib/types';
import { useEffect, useState } from 'react';
import styles from './Deposits.module.scss';

const Deposits = () => {
	const staking = useStaking();
	const contracts = useZnsContracts();
	const { active, account } = useWeb3React<Web3Provider>();
	const { wildPriceUsd } = useCurrency();

	const [totalRewardsClaimable, setTotalRewardsClaimable] =
		useState<MaybeUndefined<ethers.BigNumber>>();

	const [wildBalance, setWildBalance] =
		useState<MaybeUndefined<ethers.BigNumber>>();

	useEffect(() => {
		let isMounted = true;

		const getMetrics = async () => {
			if (!account || !staking.pools) {
				return;
			}

			const lpReward = await staking.pools.lpPool.instance.pendingYieldRewards(
				account,
			);
			const wildReward =
				await staking.pools.wildPool.instance.pendingYieldRewards(account);

			const totalReward = lpReward.add(wildReward);

			if (isMounted) {
				setTotalRewardsClaimable(totalReward);
			}

			const wildTokenBalance = await contracts!.wildToken.balanceOf(account);
			setWildBalance(wildTokenBalance);
		};
		getMetrics();

		return () => {
			isMounted = false;
		};
	}, [account, staking.pools]);

	return (
		<>
			<ul className={styles.Stats}>
				<StatsWidget
					className="normalView"
					fieldName={'Wallet WILD Balance'}
					isLoading={active && wildBalance === undefined}
					title={
						active && wildBalance !== undefined
							? displayEther(wildBalance)
							: '-'
					}
					subTitle={
						wildBalance &&
						wildPriceUsd &&
						'$' + displayEtherToFiat(wildBalance, wildPriceUsd)
					}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'Total Rewards Claimable'}
					isLoading={active && totalRewardsClaimable === undefined}
					title={
						active && totalRewardsClaimable !== undefined
							? displayEther(totalRewardsClaimable) + ' WILD'
							: '-'
					}
					subTitle={
						totalRewardsClaimable &&
						wildPriceUsd &&
						'$' + displayEtherToFiat(totalRewardsClaimable, wildPriceUsd)
					}
				/>
			</ul>
			<DepositTable />
		</>
	);
};

export default Deposits;
