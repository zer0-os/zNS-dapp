import { useMemo, useState } from 'react';

import Stake from './steps/Stake/Stake';
import Approve, { ApprovalStep } from './steps/Approve/Approve';

import styles from './StakeFlow.module.scss';

import classNames from 'classnames/bind';

enum Steps {
	Stake,
	Approve,
}

const cx = classNames.bind(styles);

const StakeFlow = () => {
	const [step, setStep] = useState<Steps>(Steps.Stake);

	const stepNode = useMemo(() => {
		switch (step) {
			case Steps.Stake:
				return <Stake />;
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
