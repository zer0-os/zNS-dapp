import { useMemo, useState } from 'react';

import Claim from './steps/Claim/Claim';
import { Confirm, Header } from '../';

import { useStaking } from 'lib/providers/staking/StakingProvider';

import styles from './ClaimFlow.module.scss';

import classNames from 'classnames/bind';
import { LoadingIndicator } from 'components';

enum Steps {
	Claim,
	Confirm,
	Processing,
}

const cx = classNames.bind(styles);

type StakeFlowProps = {
	onClose: () => void;
};

const StakeFlow = (props: StakeFlowProps) => {
	const { onClose } = props;
	const { stakingOn } = useStaking();

	const rewardAmount = 1241;
	const HEADER = <Header text="Claim Pool Rewards" />;

	const [step, setStep] = useState<Steps>(Steps.Claim);
	const [message, setMessage] = useState<
		{ content: string; error?: boolean } | undefined
	>();

	const onClaim = () => {
		setStep(Steps.Confirm);
	};

	const onConfirm = () => {
		setStep(Steps.Processing);
		setTimeout(() => {
			setMessage({ content: `${rewardAmount} WILD claimed successfully` });
			setStep(Steps.Claim);
		}, 3000);
	};

	const stepNode = useMemo(() => {
		switch (step) {
			case Steps.Claim:
				return (
					<Claim
						apy={stakingOn.apy}
						totalValueLocked={stakingOn.tvl}
						message={message}
						poolIconUrl={stakingOn.image}
						poolName={stakingOn.name}
						poolDomain={stakingOn.domain}
						onBack={onClose}
						onClaim={onClaim}
						rewardAmount={rewardAmount}
					/>
				);
			case Steps.Confirm:
				return (
					<>
						{HEADER}
						<Confirm
							content={
								<>
									<p>
										When you claim pool rewards, they are staked in the WILD
										pool and can be unstaked after a 12 month vesting period.
									</p>
									<p>
										Are you sure you want to claim <b>{rewardAmount} WILD</b>{' '}
										($TODO) in pool rewards?
									</p>
								</>
							}
							hideCancel
							confirmText={'Confirm Claim'}
							onConfirm={onConfirm}
						/>
					</>
				);
			case Steps.Processing:
				return (
					<>
						{HEADER}
						<LoadingIndicator text={'Your transaction is being processed...'} />
					</>
				);

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
