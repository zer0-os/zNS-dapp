import classNames from 'classnames';
import React, { FC, useState } from 'react';
import type { Proposal, Choice } from '@zero-tech/zdao-sdk';
import { truncateWalletAddress } from 'lib/utils';
import { Overlay, Wizard } from 'components';
import { Approve, Deny } from './VoteButtons';
import { VoteModalStep } from './Vote.constants';
import styles from './Vote.module.scss';
import { formatVotingPowerAmount } from '../../Proposals.helpers';

type VoteModalProps = {
	proposal: Proposal;
	votingAddress: string;
	choice: Choice;
	votingPower: number;
	onVote: () => Promise<void>;
	onClose: () => void;
	onComplete: () => void;
};

const VoteModal: FC<VoteModalProps> = ({
	proposal,
	votingAddress,
	votingPower,
	choice,
	onVote,
	onClose,
	onComplete,
}) => {
	const [step, setStep] = useState<VoteModalStep>(VoteModalStep.CONFIRM);

	/**
	 * Calls the vote function from props
	 * Changes to error state if function throws error
	 * Calls complete prop function if vote successful
	 */
	const vote = async () => {
		setStep(VoteModalStep.PENDING);
		try {
			await onVote();
			onComplete();
		} catch (e: any) {
			console.error(e);
			setStep(e.code === 4001 ? VoteModalStep.DECLINED : VoteModalStep.ERROR);
		}
	};

	return (
		<Overlay open={true} onClose={onClose}>
			<Wizard
				header={'Confirm Vote'}
				className={styles.Modal}
				headerClassName={styles.Header}
			>
				{(step === VoteModalStep.CONFIRM ||
					step === VoteModalStep.DECLINED ||
					step === VoteModalStep.ERROR) && (
					<p>
						Are you sure you want to vote to{' '}
						{choice === 1 ? <Approve>approve</Approve> : <Deny>deny</Deny>} this
						proposal? This will be processed by the blockchain and cannot be
						reversed
					</p>
				)}
				<ul className={styles.Details}>
					<li>
						<span>Your Address</span>
						<span>{truncateWalletAddress(votingAddress, 4)}</span>
					</li>
					<li>
						<span>Your Vote</span>
						<span>
							{choice === 1 ? (
								<Approve>Approve Proposal</Approve>
							) : (
								<Deny>Deny Proposal</Deny>
							)}
						</span>
					</li>
					<li>
						<span>Your Voting Power</span>
						<span>{formatVotingPowerAmount(proposal, votingPower)}</span>
					</li>
				</ul>

				{step === VoteModalStep.DECLINED && (
					<span className={classNames('error-text', styles.Error)}>
						Vote denied by wallet
					</span>
				)}
				{step === VoteModalStep.ERROR && (
					<span className={classNames('error-text', styles.Error)}>
						Failed to submit vote - please try again.
					</span>
				)}
				{(step === VoteModalStep.CONFIRM ||
					step === VoteModalStep.DECLINED ||
					step === VoteModalStep.ERROR) && (
					<Wizard.Buttons
						onClickPrimaryButton={vote}
						onClickSecondaryButton={onClose}
					/>
				)}
				{step === VoteModalStep.PENDING && (
					<Wizard.Loading message="Vote pending - please confirm signature in your wallet" />
				)}
			</Wizard>
		</Overlay>
	);
};

export default VoteModal;
