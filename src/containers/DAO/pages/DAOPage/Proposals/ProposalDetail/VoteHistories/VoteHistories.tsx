import React, { useState, useMemo, useEffect, useCallback } from 'react';

// - Library
import { sum } from 'lodash';
import { Proposal, TokenMetaData, Vote } from '@zero-tech/zdao-sdk';
import { toFiat } from 'lib/currency';
import { truncateWalletAddress } from 'lib/utils';
import { formatTotalAmountOfTokenMetadata } from '../../PropsalsTable/ProposalsTable.helpers';

// - Component
import { LoadingIndicator } from 'components';

//- Style Imports
import styles from './VoteHistories.module.scss';

type VoteHistoriesProps = {
	proposal?: Proposal;
	metadata?: TokenMetaData;
};

export const VoteHistories: React.FC<VoteHistoriesProps> = ({
	proposal,
	metadata,
}) => {
	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [votes, setVotes] = useState<Vote[]>([]);

	const fetchVotes = useCallback(async () => {
		if (proposal) {
			setIsLoading(true);

			try {
				const votes = await proposal.listVotes();
				setVotes(votes);
			} catch (e) {
				console.error(e);
			} finally {
				setIsLoading(false);
			}
		}
	}, [proposal]);

	useEffect(() => {
		if (proposal) {
			fetchVotes();
		}
	}, [proposal, fetchVotes]);

	const histories = useMemo(() => {
		if (!proposal || !metadata || votes.length === 0) {
			return [];
		}

		const wild = formatTotalAmountOfTokenMetadata(metadata, true);
		const sumScores = sum(proposal.scores);

		return votes.map((vote, index) => {
			return {
				id: index,
				address: truncateWalletAddress(vote.voter, 4),
				direction: proposal.choices[vote.choice],
				amount: toFiat((vote.power / sumScores) * Number(wild)),
				power: toFiat((vote.power / sumScores) * 100) + '%',
			};
		});
	}, [proposal, metadata, votes]);

	return (
		<div className={styles.Container}>
			<div className={styles.Title}>Vote History</div>
			<div className={styles.Content}>
				<div className={styles.HistoryHeader}>
					<span className={styles.Address}>Address</span>
					<span className={styles.Direction}>Vote Direction</span>
					<span className={styles.Amount}>Amount (WILD)</span>
					<span className={styles.Power}>Voting Power</span>
				</div>

				{isLoading && <LoadingIndicator text="" />}

				{!isLoading && (
					<>
						{histories.length === 0 && (
							<div className={styles.Empty}>No vote history</div>
						)}

						{histories.length > 0 && (
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
											{history.direction}
										</span>

										{/* Amount (WILD) */}
										<span className={styles.Amount}>
											<strong>Amount (WILD)</strong>
											{history.amount}
										</span>

										{/* Voting Power */}
										<span className={styles.Power}>
											<strong>Voting Power</strong>
											{history.power}
										</span>
									</div>
								))}
							</div>
						)}
					</>
				)}
			</div>
		</div>
	);
};
