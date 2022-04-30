import { useState } from 'react';

import Claim from './steps/Claim/Claim';
import { Confirm } from '../';

import styles from './ClaimFlow.module.scss';

import classNames from 'classnames/bind';
import { Wizard } from 'components';
import { ethers } from 'ethers';
import { useStakingPoolSelector } from 'lib/providers/staking/PoolSelectProvider';
import { displayEther } from 'lib/currency';
import { useWeb3React } from '@web3-react/core';
import { useDidMount } from 'lib/hooks/useDidMount';

enum Steps {
	Claim,
	Confirm,
	Processing,
}

const cx = classNames.bind(styles);

type ClaimFlowProps = {
	onClose: () => void;
	onSuccess?: () => void;
};

const ClaimFlow = (props: ClaimFlowProps) => {
	const { onClose, onSuccess } = props;
	const { claiming } = useStakingPoolSelector();
	const { account, library } = useWeb3React();

	const [rewardAmount, setRewardAmount] = useState<
		ethers.BigNumber | undefined
	>();
	const [step, setStep] = useState<Steps>(Steps.Claim);
	const [message, setMessage] = useState<
		{ content: string; error?: boolean } | undefined
	>();

	useDidMount(() => {
		getRewardAmount();
	});

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
		var tx;
		try {
			tx = await claiming?.instance.processRewards(library.getSigner());
		} catch {
			setMessage({
				content: 'Transaction rejected',
				error: true,
			});
			setStep(Steps.Claim);
			return;
		}
		try {
			await tx?.wait();
			onSuccess?.();
		} catch {
			setMessage({
				content: 'Transaction failed',
				error: true,
			});
			setStep(Steps.Claim);
			return;
		}
		setMessage({
			content:
				'Successfully claimed ' +
				displayEther(rewardAmount!) +
				' WILD - view in My Deposits',
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
					<Confirm
						content={
							<>
								<p>
									When you claim pool rewards, they are staked in the WILD pool
									and can be unstaked after a 12 month vesting period.
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
				);
			case Steps.Processing:
				return (
					<Wizard.Loading message={'Your transaction is being processed...'} />
				);

			default:
				return 'error';
		}
	};

	if (!claiming) {
		return <></>;
	}

	return (
		<Wizard
			header={'Claim Pool Rewards'}
			className={cx('background-primary', 'border-rounded', 'border-primary')}
		>
			{stepNode()}
		</Wizard>
	);
};

export default ClaimFlow;
