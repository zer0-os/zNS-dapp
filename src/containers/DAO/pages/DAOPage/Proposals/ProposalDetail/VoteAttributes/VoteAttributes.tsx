import React, { useState, useMemo } from 'react';

// - Library
import moment from 'moment';
import { isEmpty } from 'lodash';
import type { zDAO, Proposal } from '@zero-tech/zdao-sdk';
import { secondsToDhms, formatDateTime } from 'lib/utils/datetime';
import {
	formatProposalStatus,
	formatTotalAmountOfTokenMetadata,
} from '../../Proposals.helpers';
import useTimer from 'lib/hooks/useTimer';
import { usePageWidth } from 'lib/hooks/usePageWidth';

// - Types
import { VoteAttribute } from './VoteAttributes.types';

// - Constants
import { VOTE_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT } from './VoteAttributes.constants';
import { DEFAULT_TIMMER_INTERVAL } from '../../Proposals.constants';

// - Components
import { EtherscanLink } from 'components';

//- Style Imports
import styles from './VoteAttributes.module.scss';

type VoteAttributesProps = {
	dao: zDAO;
	proposal: Proposal;
};

export const VoteAttributes: React.FC<VoteAttributesProps> = ({
	dao,
	proposal,
}) => {
	const [isCollapsed, toggleCollapsed] = useState<boolean>(true);

	const { pageWidth } = usePageWidth();

	const initialVisibleAttributesCount: number = useMemo(() => {
		const isTablet = pageWidth > 414 && pageWidth < 768;
		const isMobile = pageWidth <= 414;

		if (isMobile) return VOTE_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT.MOBILE;
		if (isTablet) return VOTE_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT.TABLET;
		return VOTE_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT.DESKTOP;
	}, [pageWidth]);

	const isConcluded = moment(proposal.end).isBefore(moment());
	const { time: timeRemaining } = useTimer(
		proposal.end,
		isConcluded ? null : DEFAULT_TIMMER_INTERVAL,
	);

	const attributes: VoteAttribute[] = useMemo(() => {
		if (!dao || !proposal || !proposal.metadata) {
			return [];
		}

		const parsedAttributes = [
			{
				label: 'Status',
				value: formatProposalStatus(proposal),
			},
			{
				label: 'Time Remaining',
				value: secondsToDhms(timeRemaining / 1000) || '-',
			},
			{
				label: 'Type',
				value: 'Funding',
			},
			{
				label: 'Amount',
				value: formatTotalAmountOfTokenMetadata(proposal.metadata),
			},
			{
				label: 'Voting Started',
				value: formatDateTime(proposal.start, 'M/D/YYYY h:m A Z') || '-',
			},
			{
				label: isConcluded ? 'Voting Ended' : 'Voting Ends',
				value: formatDateTime(proposal.end, 'M/D/YYYY h:m A Z') || '-',
			},
			{
				label: 'Voting System',
				value: 'Single Choice Voting',
			},
			{
				label: 'Execution Criteria',
				value: 'Absolute Majority',
			},
			{
				label: 'Creator',
				value: <EtherscanLink address={proposal.author} />,
			},
			{
				label: 'Source of Funds',
				value: 'DAO Wallet',
			},
			{
				label: 'Recipient',
				value: <EtherscanLink address={proposal.metadata.recipient ?? '-'} />,
			},
			{
				label: 'Votes Submitted',
				value: proposal.votes.toString(),
			},
		];

		return parsedAttributes.filter(
			({ value }) => !isEmpty(value) && value !== '-',
		);
	}, [dao, proposal, isConcluded, timeRemaining]);

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
