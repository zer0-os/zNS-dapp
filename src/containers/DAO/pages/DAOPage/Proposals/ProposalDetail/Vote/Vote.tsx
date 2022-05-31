import React, { useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import type { Choice, Proposal } from '@zero-tech/zdao-sdk';
import VoteModal from './VoteModal';
import VoteAction from './VoteAction';
import useVoteData from './useVoteData';
import { VoteStatus } from './Vote.constants';
import styles from './Vote.module.scss';

type VoteProps = {
	proposal: Proposal;
	onCompleteVoting: () => void;
};

/**
 * Grabs relevant data and pipes it into a component
 */
const Vote: React.FC<VoteProps> = ({ proposal, onCompleteVoting }) => {
	const { account, library } = useWeb3React();
	const { isLoading, userVote, userVotingPower } = useVoteData(
		proposal,
		account as string | undefined,
	);

	console.log({ isLoading, userVote, userVotingPower });

	const [status, setStatus] = useState<VoteStatus>(VoteStatus.NOT_STARTED);
	const [choice, setChoice] = useState<Choice | undefined>();
	const [completedVote, setCompletedVote] = useState<Choice | undefined>();

	const onVote = async () => {
		if (choice && library && account) {
			setStatus(VoteStatus.PENDING);

			try {
				await proposal.vote(library.getSigner(), account, choice);
				setStatus(VoteStatus.COMPLETE);
				onCompleteVoting();
			} catch (e) {
				console.error(e);
				setStatus(VoteStatus.ERROR);
				throw e;
			}
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
				<VoteAction
					proposal={proposal}
					account={account as string | undefined}
					isLoading={isLoading}
					uservotingPower={userVotingPower ?? 0}
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
