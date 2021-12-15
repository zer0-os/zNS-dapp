import styles from './StakePool.module.scss';
import classNames from 'classnames/bind';

import { truncateAddress } from 'lib/utils';

import { useStaking } from 'lib/providers/staking/StakingProvider';

import PoolDetails from './PoolDetails/PoolDetails';

import { HISTORY_ITEMS, HistoryItem } from './StakePool.helpers';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useEffect, useState } from 'react';

const cx = classNames.bind(styles);
const moment = require('moment');

type StakePoolProps = {
	domain: string;
};

const StakePool = (props: StakePoolProps) => {
	const walletContext = useWeb3React<Web3Provider>();
	const { active } = walletContext;

	const [pool, setPool] = useState<any | undefined>();
	const { domain } = props;
	const { pools, getPoolByDomain, selectPoolByName } = useStaking();

	const onStake = () => {
		if (pool?.name) {
			selectPoolByName(pool.name);
		}
	};

	useEffect(() => {
		if (pools !== undefined) {
			const p = getPoolByDomain(domain);
			setPool(p);
		}
	}, [pools]);

	console.log(pool);

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

	return (
		<>
			<PoolDetails
				apy={pool?.apy}
				className={containerClasses}
				contractAddress={pool?.contract.address}
				icon={pool?.image}
				name={pool?.name}
				onStake={onStake}
				ticker={pool?.tokenTicker}
				tokenName={pool?.token}
				isUserConnected={active}
				peopleStaked={pool?.numStakers}
				totalValueLocked={pool?.tvl}
				totalRewards={pool?.totalRewardsIssued}
				tokenPurchaseUrl={pool?.tokenPurchaseUrl}
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
