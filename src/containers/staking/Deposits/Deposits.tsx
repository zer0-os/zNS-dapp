import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { StatsWidget } from 'components';
import { DepositTable } from 'containers/staking';
import { ethers } from 'ethers';
import { displayEther, displayEtherToFiat, toFiat } from 'lib/currency';
import useCurrency from 'lib/hooks/useCurrency';
import { useStaking } from 'lib/providers/staking/StakingSDKProvider';
import { MaybeUndefined } from 'lib/types';
import { useEffect, useState } from 'react';
import styles from './Deposits.module.scss';

const Deposits = () => {
	const staking = useStaking();
	const { account } = useWeb3React<Web3Provider>();
	const { wildPriceUsd } = useCurrency();

	const [totalRewardsClaimable, setTotalRewardsClaimable] =
		useState<MaybeUndefined<ethers.BigNumber>>();

	const [totalStakedUsd, setTotalStakedUsd] =
		useState<MaybeUndefined<number>>();

	useEffect(() => {
		let isMounted = true;

		setTotalStakedUsd(undefined);
		setTotalRewardsClaimable(undefined);

		(async () => {
			if (!account || !staking.pools) {
				return;
			}

			// Gets total claimable rewards
			Promise.all([
				staking.pools.lpPool.instance.pendingYieldRewards(account),
				staking.pools.wildPool.instance.pendingYieldRewards(account),
			]).then(([lpRewards, wildRewards]) => {
				if (!isMounted || !lpRewards || !wildRewards) {
					// error handling
					return;
				}
				setTotalRewardsClaimable(lpRewards.add(wildRewards));
			});

			// Gets total user stake in USD
			Promise.all([
				staking.instance?.liquidityPool.userValueStaked(account),
				staking.instance?.wildPool.userValueStaked(account),
			]).then(([lpStake, wildStake]) => {
				if (!lpStake || !wildStake || !isMounted) {
					// error handling
					return;
				}
				setTotalStakedUsd(
					lpStake.userValueUnlockedUsd + wildStake.userValueUnlockedUsd,
				);
			});
		})();

		return () => {
			isMounted = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [account, staking.pools]);

	return (
		<>
			{!!account && (
				<ul className={styles.Stats}>
					<StatsWidget
						className="normalView"
						fieldName={'Your Total Stake (USD)'}
						isLoading={totalStakedUsd === undefined}
						title={
							account && totalStakedUsd !== undefined
								? '$' + toFiat(totalStakedUsd) + ' USD'
								: '$0'
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
				</ul>
			)}
			<DepositTable />
		</>
	);
};

export default Deposits;
