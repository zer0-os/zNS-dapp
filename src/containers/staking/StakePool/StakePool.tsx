import styles from './StakePool.module.scss';
import classNames from 'classnames/bind';

import { truncateAddress } from 'lib/utils';

import PoolDetails from './PoolDetails/PoolDetails';

import { HISTORY_ITEMS, HistoryItem } from './StakePool.helpers';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

const cx = classNames.bind(styles);
const moment = require('moment');

const StakePool = () => {
	const walletContext = useWeb3React<Web3Provider>();
	const { active } = walletContext;

	// Some static mock data before we load real data in
	const poolTokenTicker = 'WILD';
	const poolTokenFullName = 'Wilder World';
	const poolName = 'Stake Wild';

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
				apy={12583.5321}
				className={containerClasses}
				contractAddress={'0x123'}
				icon={'https://picsum.photos/80/80'}
				name={poolName}
				ticker={poolTokenTicker}
				tokenName={poolTokenFullName}
				isUserConnected={active}
				peopleStaked={5392}
				totalValueLocked={5378291.859321}
				totalRewards={5473885.5321}
			/>
			{/* @todo move history to its own container */}
			<section className={cx(styles.History, containerClasses)}>
				<h4>Pool History</h4>
				<ul>
					{HISTORY_ITEMS.map((item) => (
						<li>
							<div>
								<b>{truncateAddress(item.address)} </b>
								{historyTypeToString(item.type)}
								{item.amount !== undefined && item.amount > 0 && (
									<b>
										{item.amount} {poolTokenTicker}
									</b>
								)}
							</div>
							<div>{moment(Number(item.date)).fromNow()}</div>
						</li>
					))}
				</ul>
			</section>
		</>
	);
};

export default StakePool;
