import { useMemo, useState } from 'react';

import Stake from './steps/Stake/Stake';

import styles from './StakeFlow.module.scss';

import classNames from 'classnames/bind';

enum Steps {
	Stake,
}

const cx = classNames.bind(styles);

const StakeFlow = () => {
	const [step, setStep] = useState<Steps>(Steps.Stake);

	const stepNode = useMemo(() => {
		if (step === Steps.Stake) {
			return <Stake />;
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
