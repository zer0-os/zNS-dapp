import { useEffect, useState } from 'react';

import Claim from './steps/Claim/Claim';
import { Confirm, Header } from '../';

import { useStaking } from 'lib/providers/staking/StakingSDKProvider';

import styles from './ClaimFlow.module.scss';

import classNames from 'classnames/bind';
import { LoadingIndicator } from 'components';
import { ethers } from 'ethers';
import { useStakingPoolSelector } from 'lib/providers/staking/PoolSelectProvider';
import { displayEther } from 'lib/currency';
import { useWeb3React } from '@web3-react/core';

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
	const staking = useStaking();
	const { claiming } = useStakingPoolSelector();
	const { account, library } = useWeb3React();

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
		if (!account) {
			return;
		}
		const rewards = await claiming?.instance.pendingYieldRewards(account);
		setRewardAmount(rewards);
	};

	const onClaim = () => {
		setStep(Steps.Confirm);
	};

	const onConfirm = async () => {
		if (!library) {
			return;
		}
		setStep(Steps.Processing);
		const tx = await claiming?.instance.processRewards(library.getSigner());
		await tx?.wait();
		setMessage({
			content: 'Successfully claimed ' + displayEther(rewardAmount!) + ' WILD',
		});
		setStep(Steps.Claim);
		setRewardAmount(undefined);
		getRewardAmount();
	};

	const stepNode = () => {
		switch (step) {
			case Steps.Claim:
				return (
					<Claim
						apy={`${claiming!.metrics.apy.toFixed(2)} %`}
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
