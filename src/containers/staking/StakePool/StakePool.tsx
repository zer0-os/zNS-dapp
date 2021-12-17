import styles from './StakePool.module.scss';
import classNames from 'classnames/bind';

import { truncateAddress } from 'lib/utils';

import { useStaking } from 'lib/providers/staking/StakingSDKProvider';

import PoolDetails from './PoolDetails/PoolDetails';

import { HISTORY_ITEMS, HistoryItem } from './StakePool.helpers';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useEffect, useState } from 'react';
import { useStakingPoolSelector } from 'lib/providers/staking/PoolSelectProvider';
import { getPoolByDomain } from 'lib/providers/staking/StakingUtils';
import { WrappedStakingPool } from 'lib/providers/staking/StakingProviderTypes';
import { MaybeUndefined } from 'lib/types';
import { ethers } from 'ethers';
import { toFiat } from 'lib/currency';

const cx = classNames.bind(styles);
const moment = require('moment');

type StakePoolProps = {
	domain: string;
};

const StakePool = (props: StakePoolProps) => {
	const walletContext = useWeb3React<Web3Provider>();
	const { active } = walletContext;

	const [pool, setPool] = useState<MaybeUndefined<WrappedStakingPool>>();
	const { domain } = props;

	const staking = useStaking();
	const poolSelector = useStakingPoolSelector();

	const onStake = () => {
		poolSelector.selectStakePool(pool);
	};

	const [apy, setApy] = useState<number>();
	const [tokensLocked, setTokensLocked] = useState<MaybeUndefined<string>>();
	const [valueLocked, setValueLocked] = useState<MaybeUndefined<string>>();

	useEffect(() => {
		let isMounted = true;

		const getPoolData = async () => {
			if (!staking.pools) {
				return;
			}

			const pool = getPoolByDomain(staking.pools, domain);

			if (!pool) {
				return;
			}

			if (isMounted) {
				setPool(pool);
			}

			const tvl = await pool.instance.poolTvl();

			if (isMounted) {
				setValueLocked(toFiat(tvl.valueOfTokensUSD));
				setTokensLocked(toFiat(tvl.numberOfTokens));
				setApy(Number(pool.metrics.apy.toFixed(2)));
			}
		};

		getPoolData();

		return () => {
			isMounted = false;
		};
	}, [staking.pools, domain]);

	const containerClasses = cx(
		styles.Container,
		'main',
		'background-primary',
		'border-primary',
		'border-rounded',
	);

	const historyTypeToString = (type: number) => {
		switch (type) {
			case HistoryItem.Mint:
				return 'Minted';
			case HistoryItem.Stake:
				return 'Staked';
			case HistoryItem.Claim:
				return 'Claimed';
			default:
				return 'Unhandled Event';
		}
	};

	if (!pool) {
		return <></>;
	}

	return (
		<>
			<PoolDetails
				apy={apy}
				className={containerClasses}
				contractAddress={pool!.instance.address}
				icon={pool!.content.image}
				name={pool!.content.name}
				onStake={onStake}
				ticker={pool!.content.tokenTicker}
				tokenName={pool!.content.token}
				isUserConnected={active}
				peopleStaked={0}
				tokensLocked={tokensLocked}
				valueLocked={valueLocked}
				totalRewards={0}
				tokenPurchaseUrl={pool.content.tokenPurchaseUrl}
			/>
			{/* history temporarily removed */}
			{/* <section className={cx(styles.History, containerClasses)}>
				<h4>Pool History</h4>
				<ul>
					{HISTORY_ITEMS.map((item) => (
						<li>
							<div>
								<b>{truncateAddress(item.address)} </b>
								{historyTypeToString(item.type)}
								{item.amount !== undefined && item.amount > 0 && (
									<b>
										{item.amount}{' '}
										{item.type === HistoryItem.Claim ? 'WILD' : pool?.token}
									</b>
								)}
							</div>
							<div>{moment(Number(item.date)).fromNow()}</div>
						</li>
					))}
				</ul>
			</section> */}
		</>
	);
};

export default StakePool;
