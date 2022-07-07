import React from 'react';
import { Link } from 'react-router-dom';
import type { Choice, Proposal } from '@zero-tech/zdao-sdk';
import {
	LoadingIndicator,
	Tooltip,
	QuestionButton,
	TextButton,
} from 'components';
import { ConnectWalletButton } from 'containers';
import { useCurrentDao } from 'lib/dao/providers/CurrentDaoProvider';
import VoteButtons, { Approve, Deny } from './VoteButtons';
import { VoteStatus } from './Vote.constants';
import {
	isFromSnapshotWithMultipleChoices,
	getSnpashotProposalLink,
} from '../../Proposals.helpers';
import styles from './Vote.module.scss';

interface VoteActionProps {
	proposal: Proposal;
	account: string | undefined;
	isLoading: boolean;
	userVote: Choice | undefined;
	uservotingPower: number;
	voteStatus: VoteStatus;
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
	onClickApprove,
	onClickDeny,
}) => {
	const { dao } = useCurrentDao();

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
				<Tooltip
					text={
						<span className={styles.Tooltip}>
							In order to have voting power, you must hold the voting token at
							the time this proposal was created.
						</span>
					}
				>
					<QuestionButton small />
				</Tooltip>
			</span>
		);
	}

	if (isFromSnapshotWithMultipleChoices(proposal)) {
		const snapshotProposalLink = getSnpashotProposalLink(dao!, proposal);
		return (
			<span className={`${styles.FooterText} ${styles.Snapshot}`}>
				Please vote on this proposal using
				<Link
					to={{ pathname: snapshotProposalLink }}
					target="_blank"
					rel="noreferrer"
				>
					<TextButton>
						<strong> Snapshot</strong>
					</TextButton>
				</Link>
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
		const hasVotes = proposal.votes > 0;
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
