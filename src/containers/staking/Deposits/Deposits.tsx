// React imports
import { useEffect, useState } from 'react';

// Web3 imports
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

// Library imports
import { useZnsContracts } from 'lib/contracts';
import { displayEther, displayEtherToFiat, toFiat } from 'lib/currency';
import useCurrency from 'lib/hooks/useCurrency';
import { useStaking } from 'lib/providers/staking/StakingSDKProvider';
import { MaybeUndefined } from 'lib/types';

// Component & container imports
import { StatsWidget } from 'components';
import { DepositTable } from 'containers/staking';

// Style imports
import styles from './Deposits.module.scss';

const Deposits = () => {
	// Relevant hooks
	const staking = useStaking();
	const contracts = useZnsContracts();
	const { active, account } = useWeb3React<Web3Provider>();
	const { wildPriceUsd } = useCurrency();

	// User data
	const [totalRewardsClaimable, setTotalRewardsClaimable] =
		useState<MaybeUndefined<ethers.BigNumber>>();
	const [wildBalance, setWildBalance] =
		useState<MaybeUndefined<ethers.BigNumber>>();
	const [totalStakedUsd, setTotalStakedUsd] =
		useState<MaybeUndefined<number>>();

	// On load, get user data and store in state
	useEffect(() => {
		let isMounted = true;

		setWildBalance(undefined);
		setTotalStakedUsd(undefined);
		setTotalRewardsClaimable(undefined);

		// Gets all user metrics: wild balance, claimable rewards, total stake (usd)
		(async () => {
			if (!account || !staking.pools) {
				return;
			}

			// Gets user's WILD balance
			contracts!.wildToken.balanceOf(account).then((balance) => {
				setWildBalance(balance);
			});

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
						isLoading={account !== null && totalStakedUsd === undefined}
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
