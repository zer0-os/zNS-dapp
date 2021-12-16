import { FutureButton } from 'components';
import { StakeModule } from 'containers/staking';
import { ethers } from 'ethers';
import { displayEther } from 'lib/currency';

import { PoolData, Message, Back } from '../../..';

import styles from './Claim.module.scss';

type StakeProps = {
	apy: number;
	message: { error?: boolean; content: string } | undefined;
	poolIconUrl: string;
	poolName: string;
	poolDomain: string;
	onBack: () => void;
	onClaim: (amount: number) => void;
	isTransactionPending?: boolean;
	rewardAmount?: ethers.BigNumber;
};

const Claim = (props: StakeProps) => {
	const {
		apy,
		message,
		poolIconUrl,
		poolName,
		poolDomain,
		onBack,
		onClaim,
		isTransactionPending,
		rewardAmount,
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
				pendingRewards={rewardAmount}
			/>
			{(rewardAmount === undefined || rewardAmount.gt(0)) && (
				<FutureButton
					className="width-full"
					loading={isTransactionPending}
					onClick={onClaim}
					glow
				>
					Claim {rewardAmount && displayEther(rewardAmount)} WILD
				</FutureButton>
			)}
		</div>
	);
};

export default Claim;
