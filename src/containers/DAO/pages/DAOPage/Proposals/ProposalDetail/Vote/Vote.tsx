import React, { FC, useState } from 'react';

import { LoadingIndicator } from 'components';
import { ConnectWalletButton } from 'containers';
import VoteModal from './VoteModal';
import VoteButtons from './VoteButtons';

import type { Choice, Proposal } from '@zero-tech/zdao-sdk';
import { Wallet } from 'ethers';
import { useWeb3React } from '@web3-react/core';
import useVoteData from './useVoteData';

import styles from './Vote.module.scss';

type VoteProps = {
	proposal: Proposal;
};

enum VoteStatus {
	NOT_STARTED,
	PENDING_CONFIRMATION,
	SIGNING,
	PENDING,
	COMPLETE,
	ERROR,
}

/**
 * Grabs relevant data and pipes it into a component
 */
const Vote: React.FC<VoteProps> = ({ proposal }) => {
	const { account, library } = useWeb3React();
	const { isLoading, userVote, userVotingPower } = useVoteData(
		proposal,
		account as string | undefined,
	);
	const { vote, status } = useVote(proposal);

	const [choice, setChoice] = useState<Choice | undefined>();
	const [completedVote, setCompletedVote] = useState<Choice | undefined>();
	const isProposalClosed = proposal.state === 'closed';

	const onVote = async () => {
		if (choice && library) {
			await vote(library.getSigner(), choice);
			return;
		} else {
			throw new Error('Invalid vote data');
		}
	};

	const onCloseModal = () => {
		setChoice(undefined);
	};

	const onCompleteModal = () => {
		setCompletedVote(choice);
		onCloseModal();
	};

	return (
		<>
			{choice && account && (
				<VoteModal
					choice={choice}
					votingAddress={account}
					votingPower={userVotingPower ?? 0}
					onVote={onVote}
					onClose={() => setChoice(undefined)}
					onComplete={onCompleteModal}
				/>
			)}
			<footer className={styles.Container}>
				<Action
					isProposalClosed={isProposalClosed}
					account={account as string | undefined}
					isLoading={isLoading}
					userVote={completedVote ?? userVote}
					voteStatus={status}
					onClickApprove={() => setChoice(1)}
					onClickDeny={() => setChoice(2)}
				/>
			</footer>
		</>
	);
};

export default Vote;

type ActionProps = {
	isProposalClosed: boolean;
	account: string | undefined;
	isLoading: boolean;
	userVote: Choice | undefined;
	voteStatus: VoteStatus;
	onClickApprove: () => void;
	onClickDeny: () => void;
};

/**
 * Renders actions based on props.
 * @param isProposalClosed has proposal voting ended
 * @param account wallet ID of connected account
 * @param isLoading is user vote data loading
 * @param userVote the vote the user made, if any
 * @param voteStatus current progress of voting modal
 * @param onClickApprove event fired when approve is clicked
 * @param onClickDeny event fired when deny is clicked
 */
const Action: React.FC<ActionProps> = ({
	isProposalClosed,
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
				{isProposalClosed ? 'Connect Wallet' : 'Connect Wallet To Vote'}
			</ConnectWalletButton>
		);
	}

	if (isLoading) {
		return null;
	}

	if (voteStatus === VoteStatus.PENDING) {
		return <LoadingIndicator spinnerPosition="left" text="Vote in progress" />;
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

	if (isProposalClosed) {
		return (
			<span className={styles.FooterText}>
				This proposal is <Deny>closed</Deny>
			</span>
		);
	}

	return (
		<VoteButtons onClickApprove={onClickApprove} onClickDeny={onClickDeny} />
	);
};

/*
 * Approve / Deny buttons
 */

export const Approve: FC = ({ children }) => (
	<span className={styles.Approve}>{children}</span>
);

export const Deny: FC = ({ children }) => (
	<span className={styles.Deny}>{children}</span>
);

const useVote = (proposal: Proposal) => {
	const [status, setStatus] = useState<VoteStatus>(VoteStatus.NOT_STARTED);

	const vote = async (signer: Wallet, choice: Choice) => {
		setStatus(VoteStatus.PENDING);
		try {
			await new Promise((r) => setTimeout(r, 2000));
			// TODO: enable sdk voting
			setStatus(VoteStatus.COMPLETE);
		} catch (e) {
			console.error(e);
			setStatus(VoteStatus.ERROR);
			throw e;
		}
	};

	return {
		vote,
		status,
	};
};
