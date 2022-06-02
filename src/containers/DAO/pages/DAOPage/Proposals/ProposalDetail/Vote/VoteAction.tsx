import React from 'react';
import type { Choice, Proposal } from '@zero-tech/zdao-sdk';
import { LoadingIndicator, Tooltip, QuestionButton } from 'components';
import { ConnectWalletButton } from 'containers';
import VoteButtons, { Approve, Deny } from './VoteButtons';
import { VoteStatus } from './Vote.constants';
import styles from './Vote.module.scss';

interface VoteActionProps {
	proposal: Proposal;
	account: string | undefined;
	isLoading: boolean;
	userVote: Choice | undefined;
	uservotingPower: number;
	voteStatus: VoteStatus;
	votesCount: number;
	onClickApprove: () => void;
	onClickDeny: () => void;
}

/**
 * Renders actions based on props.
 * @param proposal Proposal
 * @param account wallet ID of connected account
 * @param isLoading is user vote data loading
 * @param userVote the vote the user made, if any
 * @param uservotingPower the voting power of the account
 * @param voteStatus current progress of voting modal
 * @param votesCount current votes count of proposal
 * @param onClickApprove event fired when approve is clicked
 * @param onClickDeny event fired when deny is clicked
 */
export const VoteAction: React.FC<VoteActionProps> = ({
	proposal,
	account,
	isLoading,
	userVote,
	uservotingPower,
	voteStatus,
	votesCount,
	onClickApprove,
	onClickDeny,
}) => {
	if (!account) {
		return (
			<ConnectWalletButton>
				{proposal.state === 'active'
					? 'Connect Wallet To Vote'
					: 'Connect Wallet'}
			</ConnectWalletButton>
		);
	}

	if (isLoading) {
		return null;
	}

	if (voteStatus === VoteStatus.PENDING) {
		return <LoadingIndicator spinnerPosition="left" text="" />;
	}

	if (!uservotingPower) {
		return (
			<span className={styles.FooterText}>
				Your wallet is not eligible to vote on this proposal
				<Tooltip text="In order to have voting power, you must hold the voting token at the time this proposal was created.">
					<QuestionButton small />
				</Tooltip>
			</span>
		);
	}

	if (userVote !== undefined) {
		return (
			<span className={styles.FooterText}>
				You voted to{' '}
				{userVote === 1 ? <Approve>Approve</Approve> : <Deny>Deny</Deny>} this
				proposal
			</span>
		);
	}

	if (proposal.state === 'closed') {
		const hasVotes = votesCount > 0;
		const isApproved = proposal.scores[0] > proposal.scores[1];

		return (
			<span className={styles.FooterText}>
				Voting has concluded.{' '}
				{hasVotes && (
					<>
						This proposal is{' '}
						{isApproved ? <Approve>Approved</Approve> : <Deny>Denied</Deny>}
					</>
				)}
			</span>
		);
	}

	return (
		<VoteButtons onClickApprove={onClickApprove} onClickDeny={onClickDeny} />
	);
};

export default VoteAction;
