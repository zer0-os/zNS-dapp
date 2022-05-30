import React, { useMemo } from 'react';

// - Library
import type { Proposal, Vote } from '@zero-tech/zdao-sdk';
import { truncateWalletAddress } from 'lib/utils';

// - Component
import { LoadingIndicator } from 'components';

//- Style Imports
import styles from './VoteHistories.module.scss';
import { Approve, Deny } from '../Vote/VoteButtons';

type VoteHistoriesProps = {
	proposal?: Proposal;
	isLoading: boolean;
	votes: Vote[];
};

export const VoteHistories: React.FC<VoteHistoriesProps> = ({
	proposal,
	isLoading = true,
	votes = [],
}) => {
	const histories = useMemo(() => {
		if (!proposal || !proposal.metadata || votes.length === 0) {
			return [];
		}

		return votes.map((vote, index) => {
			return {
				id: index,
				address: truncateWalletAddress(vote.voter, 4),
				direction: vote.choice,
				power: vote.power,
			};
		});
	}, [proposal, votes]);

	return (
		<div className={styles.Container}>
			<div className={styles.Title}>Vote History</div>
			<div className={styles.Content}>
				{isLoading && <LoadingIndicator text="" />}

				{!isLoading && (
					<>
						{histories.length === 0 && (
							<div className={styles.Empty}>No votes found!</div>
						)}

						{histories.length > 0 && (
							<>
								<div className={styles.HistoryHeader}>
									<span className={styles.Address}>Address</span>
									<span className={styles.Direction}>Vote Direction</span>
									<span className={styles.Power}>Voting Power</span>
								</div>
								<div className={styles.Histories}>
									{histories.map((history, i: number) => (
										<div className={styles.HistoryRow} key={i}>
											{/* Address */}
											<span className={styles.Address}>
												<strong>Address</strong>
												{history.address}
											</span>

											{/* Vote Direction */}
											<span className={styles.Direction}>
												<strong>Vote Direction</strong>
												{history.direction === 1 ? (
													<Approve>
														{proposal?.choices[history.direction - 1]}
													</Approve>
												) : (
													<Deny>
														{proposal?.choices[history.direction - 1]}
													</Deny>
												)}
											</span>

											{/* Voting Power */}
											<span className={styles.Power}>
												<strong>Voting Power</strong>
												{history.power} {proposal?.metadata?.symbol}
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
