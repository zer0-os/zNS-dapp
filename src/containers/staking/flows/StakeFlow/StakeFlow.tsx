import { useEffect, useMemo, useState } from 'react';

import Stake from './steps/Stake/Stake';
import Approve, { ApprovalStep } from './steps/Approve/Approve';

import { useStaking } from 'lib/providers/staking/StakingProvider';

import styles from './StakeFlow.module.scss';

import classNames from 'classnames/bind';
import { ethers } from 'ethers';

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
	const {
		selectedPool,
		stake,
		checkApproval,
		approve,
		getBalanceByPoolName,
		checkRewards,
	} = useStaking();

	const [step, setStep] = useState<Steps>(Steps.Stake);
	const [isTransactionPending, setIsTransactionPending] =
		useState<boolean>(false);
	const [message, setMessage] = useState<Message | undefined>();
	const [amount, setAmount] = useState<number | undefined>(); // Amount user wants to stake
	const [balance, setBalance] = useState<ethers.BigNumber | undefined>();
	const [pendingRewards, setPendingRewards] = useState<
		ethers.BigNumber | undefined
	>();

	// Approval stuff
	const [approvalStep, setApprovalStep] = useState<ApprovalStep>(
		ApprovalStep.Prompt,
	);

	useEffect(() => {
		const get = async () => {
			const balance = await getBalanceByPoolName(selectedPool.name);
			const rewards = await checkRewards(selectedPool.name);
			console.log(rewards);
			setBalance(balance);
			setPendingRewards(rewards);
		};
		get();
	}, []);

	const onContinueApproval = async () => {
		setApprovalStep(ApprovalStep.WaitingForWallet);
		const tx = await approve(selectedPool.name);
		setApprovalStep(ApprovalStep.Approving);
		await tx?.wait();
		setStep(Steps.Stake);
		onStake(amount!);
	};

	const onCancelApproval = () => {
		setStep(Steps.Stake);
		setIsTransactionPending(false);
	};

	const onStake = async (amount: number) => {
		setMessage(undefined);
		setIsTransactionPending(true);
		setAmount(amount);

		const approval = await checkApproval(selectedPool.name, amount);

		// If needs approving
		if (approval === false) {
			setStep(Steps.Approve);
			setApprovalStep(ApprovalStep.Prompt);
			return;
		}

		// If already approved
		const tx = await stake(amount);
		const success = await tx?.wait();
		if (success) {
			setMessage({
				content: `${amount.toLocaleString()} ${
					selectedPool.tokenTicker
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

	const stepNode = () => {
		switch (step) {
			case Steps.Stake:
				return (
					<Stake
						amount={amount}
						balance={balance}
						apy={selectedPool.apy}
						pendingRewards={pendingRewards}
						message={message}
						poolIconUrl={selectedPool.image}
						poolName={selectedPool.name}
						poolDomain={selectedPool.domain}
						onBack={onClose}
						onStake={onStake}
						isTransactionPending={isTransactionPending}
						token={selectedPool.tokenTicker}
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
