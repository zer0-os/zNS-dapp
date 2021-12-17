import { useEffect, useState } from 'react';

import Claim from './steps/Claim/Claim';
import { Confirm, Header } from '../';

import { useStaking } from 'lib/providers/staking/StakingProvider';

import styles from './ClaimFlow.module.scss';

import classNames from 'classnames/bind';
import { LoadingIndicator } from 'components';
import { ethers } from 'ethers';
import { useStakingPoolSelector } from 'lib/providers/staking/PoolSelectProvider';
import { displayEther } from 'lib/currency';

enum Steps {
	Claim,
	Confirm,
	Processing,
}

const cx = classNames.bind(styles);

type ClaimFlowProps = {
	onClose: () => void;
};

const ClaimFlow = (props: ClaimFlowProps) => {
	const { onClose } = props;
	const { checkRewards, claimRewards } = useStaking();
	const { claiming } = useStakingPoolSelector();

	const HEADER = <Header text="Claim Pool Rewards" />;

	const [rewardAmount, setRewardAmount] = useState<
		ethers.BigNumber | undefined
	>();
	const [step, setStep] = useState<Steps>(Steps.Claim);
	const [message, setMessage] = useState<
		{ content: string; error?: boolean } | undefined
	>();

	useEffect(() => {
		getRewardAmount();
	}, []);

	const getRewardAmount = async () => {
		const rewards = await checkRewards(claiming!.content.name);
		setRewardAmount(rewards);
	};

	const onClaim = () => {
		setStep(Steps.Confirm);
	};

	const onConfirm = () => {
		setStep(Steps.Processing);
		claimRewards(claiming!.content.name).then((d) => {
			setStep(Steps.Claim);
			setRewardAmount(undefined);
			getRewardAmount();
		});
	};

	const stepNode = () => {
		switch (step) {
			case Steps.Claim:
				return (
					<Claim
						apy={'0'}
						message={message}
						poolIconUrl={claiming!.content.image}
						poolName={claiming!.content.name}
						poolDomain={claiming!.content.domain}
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
										Are you sure you want to claim{' '}
										<b>{displayEther(rewardAmount!)} WILD</b> in pool rewards?
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
	};

	if (!claiming) {
		return <></>;
	}

	return (
		<div
			className={cx(
				styles.Container,
				'background-primary',
				'border-rounded',
				'border-primary',
			)}
		>
			{stepNode()}
		</div>
	);
};

export default ClaimFlow;
