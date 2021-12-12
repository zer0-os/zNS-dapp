import { useMemo, useState } from 'react';

import Stake from './steps/Stake/Stake';
import Approve, { ApprovalStep } from './steps/Approve/Approve';

import { useStaking } from 'lib/providers/staking/StakingProvider';

import styles from './StakeFlow.module.scss';

import classNames from 'classnames/bind';

enum Steps {
	Stake,
	Approve,
}

const cx = classNames.bind(styles);

type StakeFlowProps = {
	onClose: () => void;
};

const StakeFlow = (props: StakeFlowProps) => {
	const { onClose } = props;
	const { stakingOn } = useStaking();

	const [step, setStep] = useState<Steps>(Steps.Stake);

	const onStake = (amount: number) => {
		console.log(amount);
		setStep(Steps.Approve);
	};

	const stepNode = useMemo(() => {
		switch (step) {
			case Steps.Stake:
				return (
					<Stake
						apy={stakingOn.apy}
						totalValueLocked={stakingOn.tvl}
						message={undefined}
						poolIconUrl={stakingOn.image}
						poolName={stakingOn.name}
						poolDomain={stakingOn.domain}
						onBack={onClose}
						onStake={onStake}
						isTransactionPending
					/>
				);
			case Steps.Approve:
				return <Approve step={ApprovalStep.Approving} />;
			default:
				return 'error';
		}
	}, [step]);

	return (
		<div
			className={cx(
				styles.Container,
				'background-primary',
				'border-rounded',
				'border-primary',
			)}
		>
			{stepNode}
		</div>
	);
};

export default StakeFlow;
