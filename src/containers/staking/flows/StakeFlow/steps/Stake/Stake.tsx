import { StakeModule } from 'containers/staking';
import { ethers } from 'ethers';

import { PoolData, Message, Back } from '../../../';

import styles from './Stake.module.scss';

type StakeProps = {
	amount?: string;
	apy?: number;
	balance?: ethers.BigNumber;
	pendingRewards?: ethers.BigNumber;
	message: { error?: boolean; content: string } | undefined;
	poolIconUrl: string;
	poolName: string;
	poolDomain: string;
	onBack: () => void;
	onStake: (amount: string) => void;
	isTransactionPending?: boolean;
	token: string;
	wildToUsd: number;
	rewardsPending?: ethers.BigNumber;
};

const Stake = (props: StakeProps) => {
	const {
		amount,
		balance,
		apy,
		pendingRewards,
		message,
		poolIconUrl,
		poolName,
		poolDomain,
		onBack,
		onStake,
		isTransactionPending,
		token,
		wildToUsd,
	} = props;

	return (
		<div className={styles.Container}>
			<Back onBack={onBack} text={'All Pools'} />
			{message && <Message message={message.content} error={message.error} />}
			<PoolData
				domain={poolDomain}
				name={poolName}
				image={poolIconUrl}
				id={'123'}
				poolUrl={'https://youtube.com/'}
				apy={apy || 0}
				pendingRewards={pendingRewards}
				wildToUsd={wildToUsd}
			/>
			<StakeModule
				amount={amount}
				className="border-rounded"
				balance={balance}
				onStake={onStake}
				tokenName={token}
				isLoading={isTransactionPending}
				pendingRewards={pendingRewards}
			/>
		</div>
	);
};

export default Stake;
