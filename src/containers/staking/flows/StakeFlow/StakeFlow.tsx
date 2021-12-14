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
	const { selectedPool } = useStaking();

	const [step, setStep] = useState<Steps>(Steps.Stake);

	const onStake = (amount: number) => {
		setStep(Steps.Approve);
	};

	const stepNode = useMemo(() => {
		switch (step) {
			case Steps.Stake:
				return (
					<Stake
						apy={selectedPool.apy}
						totalValueLocked={selectedPool.tvl}
						message={undefined}
						poolIconUrl={selectedPool.image}
						poolName={selectedPool.name}
						poolDomain={selectedPool.domain}
						onBack={onClose}
						onStake={onStake}
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
