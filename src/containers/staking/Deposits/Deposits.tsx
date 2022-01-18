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

	const [totalStakedUsd, setTotalStakedUsd] =
		useState<MaybeUndefined<number>>();

	useEffect(() => {
		let isMounted = true;

		setWildBalance(undefined);
		setTotalRewardsClaimable(undefined);

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

			Promise.all([
				staking.instance?.liquidityPool.userValueStaked(account),
				staking.instance?.wildPool.userValueStaked(account),
			]).then(([lpStake, wildStake]) => {
				if (!lpStake || !wildStake) {
					// do something
					return;
				}
				setTotalStakedUsd(
					lpStake.userValueUnlockedUsd + wildStake.userValueUnlockedUsd,
				);
			});

			contracts!.wildToken.balanceOf(account).then((balance) => {
				setWildBalance(balance);
			});
		};
		getMetrics();

		return () => {
			isMounted = false;
		};
	}, [account, staking.pools]);

	return (
		<>
			{account !== null && (
				<ul className={styles.Stats}>
					<StatsWidget
						className="normalView"
						fieldName={'Wallet WILD Balance'}
						isLoading={active !== null && wildBalance === undefined}
						title={
							account && wildBalance !== undefined
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
						isLoading={account !== null && totalRewardsClaimable === undefined}
						title={
							account && totalRewardsClaimable !== undefined
								? displayEther(totalRewardsClaimable) + ' WILD'
								: '-'
						}
						subTitle={
							totalRewardsClaimable &&
							wildPriceUsd &&
							'$' + displayEtherToFiat(totalRewardsClaimable, wildPriceUsd)
						}
					/>
					<StatsWidget
						className="normalView"
						fieldName={'Your Total Stake (USD)'}
						isLoading={account !== null && !totalStakedUsd}
						title={
							account && totalStakedUsd !== undefined
								? '$' + toFiat(totalStakedUsd) + ' USD'
								: '-'
						}
					/>
				</ul>
			)}
			<DepositTable />
		</>
	);
};

export default Deposits;
