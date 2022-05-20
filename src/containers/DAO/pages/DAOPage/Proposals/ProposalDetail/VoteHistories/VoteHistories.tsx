import React, { useMemo } from 'react';

// - Library
import { sum } from 'lodash';
import { Proposal, Vote } from '@zero-tech/zdao-sdk';
import { toFiat } from 'lib/currency';
import { truncateWalletAddress } from 'lib/utils';
import { formatTotalAmountOfTokenMetadata } from '../../PropsalsTable/ProposalsTable.helpers';

// - Component
import { LoadingIndicator } from 'components';

//- Style Imports
import styles from './VoteHistories.module.scss';

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

		const wild = formatTotalAmountOfTokenMetadata(proposal.metadata, true);
		const sumScores = sum(proposal.scores);

		return votes.map((vote, index) => {
			return {
				id: index,
				address: truncateWalletAddress(vote.voter, 4),
				direction: proposal.choices[vote.choice],
				amount: toFiat((vote.power / sumScores) * Number(wild), {
					maximumFractionDigits: 2,
					minimumFractionDigits: 0,
				}),
				power:
					toFiat((vote.power / sumScores) * 100, {
						maximumFractionDigits: 2,
						minimumFractionDigits: 0,
					}) + '%',
			};
		});
	}, [proposal, votes]);

	return (
		<div className={styles.Container}>
			<div className={styles.Title}>Vote History</div>
			<div className={styles.Content}>
				<div className={styles.HistoryHeader}>
					<span className={styles.Address}>Address</span>
					<span className={styles.Direction}>Vote Direction</span>
					<span className={styles.Amount}>
						Amount ({proposal?.metadata?.symbol})
					</span>
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
											<strong>Amount ({proposal?.metadata?.symbol})</strong>
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
