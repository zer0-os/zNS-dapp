import React, { useMemo } from 'react';

// - Library
import type { zDAO, Proposal, Vote } from '@zero-tech/zdao-sdk';
import { formatVotingPowerAmount } from '../../Proposals.helpers';

// - Component
import { LoadingIndicator, EtherscanLink } from 'components';

//- Style Imports
import styles from './VoteHistories.module.scss';
import { Approve, Deny } from '../Vote/VoteButtons';

type VoteHistoriesProps = {
	dao?: zDAO;
	proposal?: Proposal;
	isLoading: boolean;
	votes: Vote[];
};

export const VoteHistories: React.FC<VoteHistoriesProps> = ({
	dao,
	proposal,
	isLoading = true,
	votes = [],
}) => {
	const isSnapshotProposal = !proposal?.metadata;
	const isERC721 = dao?.votingToken.decimals === 0;
	const vpLabel = isERC721
		? 'Voting Power (NFTs)'
		: `Amount (${dao?.votingToken.symbol})`;

	const histories = useMemo(() => {
		if (!proposal || votes.length === 0) {
			return [];
		}

		return votes.map((vote, index) => {
			return {
				id: index,
				address: vote.voter,
				direction: vote.choice,
				power: formatVotingPowerAmount(vote.power, dao?.votingToken),
			};
		});
	}, [dao, proposal, votes]);

	const emptyVoteText =
		proposal && proposal.scores.reduce((a, b) => a + b) > 0
			? 'Having trouble retrieving vote history. Please try again later.'
			: 'No votes yet...';

	return (
		<div className={styles.Container}>
			<div className={styles.Title}>Vote History</div>
			<div className={styles.Content}>
				{isLoading && <LoadingIndicator text="" />}

				{!isLoading && (
					<>
						{histories.length === 0 && (
							<div className={styles.Empty}>{emptyVoteText}</div>
						)}

						{histories.length > 0 && (
							<>
								<div className={styles.HistoryHeader}>
									<span className={styles.Address}>Address</span>
									<span className={styles.Direction}>Vote Direction</span>
									<span className={styles.Power}>{vpLabel}</span>
								</div>
								<div className={styles.Histories}>
									{histories.map((history, i: number) => (
										<div className={styles.HistoryRow} key={i}>
											{/* Address */}
											<span className={styles.Address}>
												<strong>Address</strong>
												<EtherscanLink address={history.address} />
											</span>

											{/* Vote Direction */}
											<span className={styles.Direction}>
												<strong>Vote Direction</strong>
												{!isSnapshotProposal ? (
													history.direction === 1 ? (
														<Approve>
															{proposal?.choices[history.direction - 1]}
														</Approve>
													) : (
														<Deny>
															{proposal?.choices[history.direction - 1]}
														</Deny>
													)
												) : (
													<span className={styles.SnapshotDirection}>
														{proposal?.choices[history.direction - 1]}
													</span>
												)}
											</span>

											{/* Voting Power */}
											<span className={styles.Power}>
												<strong>{vpLabel}</strong>
												{history.power}
											</span>
										</div>
									))}
								</div>
							</>
						)}
					</>
				)}
			</div>
		</div>
	);
};
