import { StakeModule } from 'containers/staking';

import { PoolData, Message, Back } from '../../../';

import styles from './Stake.module.scss';

type StakeProps = {
	apy: number;
	totalValueLocked: number;
	message: { error?: boolean; content: string } | undefined;
	poolIconUrl: string;
	poolName: string;
	poolDomain: string;
	onBack: () => void;
	onStake: (amount: number) => void;
	isTransactionPending?: boolean;
};

const Stake = (props: StakeProps) => {
	const {
		apy,
		totalValueLocked,
		message,
		poolIconUrl,
		poolName,
		poolDomain,
		onBack,
		onStake,
		isTransactionPending,
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
				apy={apy}
				totalValueLocked={totalValueLocked}
			/>
			<StakeModule
				className="border-rounded"
				balance={10000}
				onStake={onStake}
				tokenName={'WILD'}
				isLoading={isTransactionPending}
			/>
		</div>
	);
};

export default Stake;
