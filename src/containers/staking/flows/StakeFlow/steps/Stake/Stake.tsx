import { ConnectWalletButton } from 'containers';
import { StakeModule } from 'containers/staking';
import { ethers } from 'ethers';

import { PoolData, Message, Back } from '../../../';

import styles from './Stake.module.scss';

type StakeProps = {
	amount?: string;
	apy?: string;
	balance?: ethers.BigNumber;
	pendingRewards?: ethers.BigNumber;
	message: { error?: boolean; content: string } | undefined;
	poolIconUrl: string;
	poolName: string;
	poolDomain: string;
	onBack: () => void;
	onStake: (amount: string) => void;
	isTransactionPending?: boolean;
	isUserConnected?: boolean;
	token: string;
	wildToUsd: number;
	rewardsPending?: ethers.BigNumber;
	unstake?: boolean;
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
		isUserConnected,
		token,
		wildToUsd,
		unstake,
	} = props;

	return (
		<div className={styles.Container}>
			<Back onBack={onBack} text={'Back'} />
			{message && <Message message={message.content} error={message.error} />}
			<PoolData
				domain={poolDomain}
				name={poolName}
				image={poolIconUrl}
				id={'123'}
				poolUrl={'https://youtube.com/'}
				apy={apy}
				pendingRewards={pendingRewards}
				wildToUsd={wildToUsd}
				isUserConnected={isUserConnected}
			/>
			{isUserConnected ? (
				<StakeModule
					amount={amount}
					className="border-rounded"
					balance={balance}
					onStake={onStake}
					tokenName={token}
					isLoading={isTransactionPending}
					unstake={unstake}
				/>
			) : (
				<ConnectWalletButton className={styles.Connect}>
					Connect Wallet To Stake
				</ConnectWalletButton>
			)}
		</div>
	);
};

export default Stake;
