import React, { useState, useMemo } from 'react';

// - Library
import moment from 'moment';
import { sum } from 'lodash';
import { Proposal, Vote } from '@zero-tech/zdao-sdk';
import { secondsToDhms, formatDateTime } from 'lib/utils/datetime';
import { toFiat } from 'lib/currency';
import {
	formatProposalStatus,
	formatTotalAmountOfTokenMetadata,
} from '../../Proposals.helpers';
import { truncateWalletAddress } from 'lib/utils';

// - Types
import { VoteAttribute } from './VoteAttributes.types';

// - Constants
import { VOTE_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT } from './VoteAttributes.constants';

//- Style Imports
import styles from './VoteAttributes.module.scss';

type VoteAttributesProps = {
	proposal?: Proposal;
	votes: Vote[];
};

export const VoteAttributes: React.FC<VoteAttributesProps> = ({
	proposal,
	votes = [],
}) => {
	const [isCollapsed, toggleCollapsed] = useState<boolean>(true);

	const initialVisibleAttributesCount: number = useMemo(() => {
		const isTablet = window.innerWidth > 414 && window.innerWidth < 768;
		const isMobile = window.innerWidth <= 414;

		if (isMobile) return VOTE_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT.MOBILE;
		if (isTablet) return VOTE_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT.TABLET;
		return VOTE_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT.DESKTOP;
	}, []);

	const attributes: VoteAttribute[] = useMemo(() => {
		if (!proposal || !proposal.metadata) {
			return [];
		}

		const amount = formatTotalAmountOfTokenMetadata(proposal.metadata, true);
		const formattedAmount = amount
			? toFiat(Number(amount), {
					maximumFractionDigits: 2,
					minimumFractionDigits: 0,
			  }) + proposal.metadata.symbol
			: '-';

		const sumScores = sum(proposal.scores);
		const votesPowers = sum(votes.map((vote) => vote.power));
		const votesSubmited = toFiat((votesPowers / sumScores) * Number(amount), {
			maximumFractionDigits: 2,
			minimumFractionDigits: 0,
		});

		// TODO: Should align the attributes
		const parsedAttributes = [
			{
				label: 'Status',
				value: formatProposalStatus(proposal),
			},
			{
				label: 'Time Remaining',
				value: secondsToDhms(moment(proposal.end).diff(moment()) / 1000) || '-',
			},
			{
				label: 'Type',
				value: 'Voting System',
			},
			{
				label: 'Amount',
				value: formattedAmount,
			},
			{
				label: 'Voting Started',
				value: formatDateTime(proposal.start, 'M/D/YYYY h:m A Z') || '-',
			},
			{
				label: 'Voting Ends',
				value: formatDateTime(proposal.start, 'M/D/YYYY h:m A Z') || '-',
			},
			{
				label: 'Voting System',
				value: 'single-choice-voting',
			},
			{
				label: 'Execution Criteria',
				value: 'Absolute Majority',
			},
			{
				label: 'Creator',
				value: truncateWalletAddress(proposal.author, 4) || '-',
			},
			{
				label: 'Source of Funds',
				value: '-',
			},
			{
				label: 'Recipient',
				value:
					truncateWalletAddress(proposal.metadata.recipient || '', 4) || '-',
			},
			{
				label: 'Votes Submitted',
				value: votesSubmited
					? votesSubmited + ' ' + proposal.metadata.symbol
					: '-',
			},
		];

		return parsedAttributes.filter(
			({ value }) => value !== '' && value !== '-',
		);
	}, [proposal, votes]);

	const initialHiddenAttributesCount: number = Math.max(
		attributes.length - initialVisibleAttributesCount,
		0,
	);

	const visibleAttributes: VoteAttribute[] = useMemo(() => {
		if (!attributes) {
			return [];
		}

		const visibleAttributesCount = isCollapsed
			? initialVisibleAttributesCount
			: attributes.length;

		return attributes.slice(0, visibleAttributesCount);
	}, [attributes, isCollapsed, initialVisibleAttributesCount]);

	if (visibleAttributes.length === 0) {
		return null;
	}

	return (
		<div className={styles.Container}>
			<ul className={styles.Wrapper}>
				{visibleAttributes.map((attribute: VoteAttribute, index: number) => (
					<li
						className={`${styles.Attribute} ${
							index > 10 ? styles.SetOpacityAnimation : ''
						}`}
						key={index}
					>
						<span className={styles.Traits}>{attribute.label}</span>
						<span className={styles.Properties}>{attribute.value} </span>
					</li>
				))}

				{/* Show / Hide more button */}
				{initialHiddenAttributesCount > 0 && (
					<div className={styles.ButtonContainer}>
						<button
							className={`${styles.ToggleAttributes} ${
								!isCollapsed ? styles.SetOpacityAnimation : ''
							}`}
							onClick={() => toggleCollapsed(!isCollapsed)}
						>
							{isCollapsed ? 'Show More' : 'Show Less'}
						</button>
					</div>
				)}
			</ul>
		</div>
	);
};
