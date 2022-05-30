import React from 'react';
import type { Choice, Proposal } from '@zero-tech/zdao-sdk';
import { LoadingIndicator } from 'components';
import { ConnectWalletButton } from 'containers';
import VoteButtons, { Approve, Deny } from './VoteButtons';
import { VoteStatus } from './Vote.constants';
import styles from './Vote.module.scss';

interface VoteActionProps {
	proposal: Proposal;
	account: string | undefined;
	isLoading: boolean;
	userVote: Choice | undefined;
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
 * @param voteStatus current progress of voting modal
 * @param onClickApprove event fired when approve is clicked
 * @param onClickDeny event fired when deny is clicked
 */
export const VoteAction: React.FC<VoteActionProps> = ({
	proposal,
	account,
	isLoading,
	userVote,
	voteStatus,
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

	if (userVote !== undefined) {
		return (
			<span className={styles.FooterText}>
				You voted to{' '}
				{userVote === 1 ? <Approve>Approve</Approve> : <Deny>Deny</Deny>} this
				proposal
			</span>
		);
	}

	if (proposal.state !== 'active') {
		return (
			<span className={styles.FooterText}>
				This proposal is <Deny>{proposal.state}</Deny>
			</span>
		);
	}

	return (
		<VoteButtons onClickApprove={onClickApprove} onClickDeny={onClickDeny} />
	);
};

export default VoteAction;
