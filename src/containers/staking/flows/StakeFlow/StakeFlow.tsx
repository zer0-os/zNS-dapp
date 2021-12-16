import { useEffect, useMemo, useState } from 'react';

import Stake from './steps/Stake/Stake';
import Approve, { ApprovalStep } from './steps/Approve/Approve';

import styles from './StakeFlow.module.scss';

import classNames from 'classnames/bind';
import { BigNumber, ethers } from 'ethers';
import { useStakingPoolSelector } from 'lib/providers/staking/PoolSelectProvider';
import { ERC20__factory } from 'types';
import { useWeb3React } from '@web3-react/core';
import { MaybeUndefined } from 'lib/types';
import { Web3Provider } from '@ethersproject/providers';
import { useRefreshToken } from 'lib/hooks/useRefreshToken';

enum Steps {
	Stake,
	Approve,
}

type Message = {
	content: string;
	error?: boolean;
};

const cx = classNames.bind(styles);

type StakeFlowProps = {
	onClose: () => void;
};

const StakeFlow = (props: StakeFlowProps) => {
	const { onClose } = props;

	const context = useWeb3React<Web3Provider>();
	const signer = context.library!.getSigner();

	const stakingPool = useStakingPoolSelector().stakePool;

	const [step, setStep] = useState<Steps>(Steps.Stake);
	const [isTransactionPending, setIsTransactionPending] =
		useState<boolean>(false);
	const [message, setMessage] = useState<Message | undefined>();
	const [stakeAmount, setStakeAmount] =
		useState<MaybeUndefined<ethers.BigNumber>>(); // Amount user wants to stake
	const [poolTokenBalance, setPoolTokenBalance] = useState<
		ethers.BigNumber | undefined
	>();
	const [pendingRewards, setPendingRewards] =
		useState<MaybeUndefined<ethers.BigNumber>>();
	const refreshToken = useRefreshToken();

	// Approval stuff
	const [approvalStep, setApprovalStep] = useState<ApprovalStep>(
		ApprovalStep.Prompt,
	);

	useEffect(() => {
		let isSubscribed = true;

		const getBalance = async () => {
			if (!stakingPool || !context.library || !context.account) {
				return;
			}

			const poolTokenAddress = await stakingPool.instance.getPoolToken();
			const token = ERC20__factory.connect(poolTokenAddress, context.library);
			const balance = await token.balanceOf(context.account);

			if (isSubscribed) {
				setPoolTokenBalance(balance);
			}

			const pendingRewards = await stakingPool.instance.pendingYieldRewards(
				context.account,
			);

			if (isSubscribed) {
				setPendingRewards(pendingRewards);
			}
		};
		getBalance();

		return () => {
			isSubscribed = false;
		};
	}, [
		stakingPool,
		context.library,
		context.account,
		refreshToken.shouldRefresh,
	]);

	const onContinueApproval = async () => {
		setApprovalStep(ApprovalStep.WaitingForWallet);
		const tx = await stakingPool!.instance.approve(signer);
		setApprovalStep(ApprovalStep.Approving);

		// property 'wait' does ont exist on type never
		// await tx?.wait();
		setStep(Steps.Stake);
		doStake(stakeAmount!);
	};

	const onCancelApproval = () => {
		setStep(Steps.Stake);
		setIsTransactionPending(false);
	};

	const doStake = async (amount: ethers.BigNumber) => {
		// If already approved
		const tx = await stakingPool!.instance.stake(
			amount.toString(),
			BigNumber.from(0),
			signer,
		);

		const success = await tx?.wait();
		refreshToken.refresh();

		if (success) {
			setMessage({
				content: `${amount.toLocaleString()} ${
					stakingPool!.content.tokenTicker
				} staked successfully`,
			});
		} else {
			setMessage({
				content: `Transaction failed`,
				error: true,
			});
		}
		setIsTransactionPending(false);
	};

	const onStake = async (amount: string) => {
		setMessage(undefined);
		setIsTransactionPending(true);
		const amountAsWei = ethers.utils.parseEther(amount);
		setStakeAmount(amountAsWei);

		const allowance = await stakingPool!.instance.allowance(signer);

		const approval = amountAsWei.lt(allowance);

		// If needs approving
		if (approval === false) {
			setStep(Steps.Approve);
			setApprovalStep(ApprovalStep.Prompt);
			return;
		}

		doStake(amountAsWei);
	};

	const stepNode = () => {
		switch (step) {
			case Steps.Stake:
				return (
					<Stake
						amount={stakeAmount}
						balance={poolTokenBalance}
						apy={0}
						pendingRewards={pendingRewards}
						message={message}
						poolIconUrl={stakingPool!.content.image}
						poolName={stakingPool!.content.name}
						poolDomain={stakingPool!.content.domain}
						onBack={onClose}
						onStake={onStake}
						isTransactionPending={isTransactionPending}
						token={stakingPool!.content.tokenTicker}
					/>
				);
			case Steps.Approve:
				return (
					<Approve
						step={approvalStep}
						onContinue={onContinueApproval}
						onCancel={onCancelApproval}
					/>
				);
			default:
				return 'error';
		}
	};

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

export default StakeFlow;
