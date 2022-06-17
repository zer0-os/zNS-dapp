import React, { useState, useMemo } from 'react';

// - Library
import moment from 'moment';
import { isEmpty } from 'lodash';
import type { zDAO, Proposal } from '@zero-tech/zdao-sdk';
import { secondsToDhms, formatDateTime } from 'lib/utils/datetime';
import {
	isFromSnapshotWithMultipleChoices,
	formatProposalStatus,
} from '../../Proposals.helpers';
import useTimer from 'lib/hooks/useTimer';
import { usePageWidth } from 'lib/hooks/usePageWidth';

// - Types
import { ProposalAttribute } from './ProposalAttributes.types';

// - Constants
import { PROPOSAL_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT } from './ProposalAttributes.constants';
import { DEFAULT_TIMMER_INTERVAL } from '../../Proposals.constants';

// - Components
import { EtherscanLink } from 'components';

//- Style Imports
import styles from './ProposalAttributes.module.scss';

type ProposalAttributesProps = {
	dao: zDAO;
	proposal: Proposal;
};

export const ProposalAttributes: React.FC<ProposalAttributesProps> = ({
	dao,
	proposal,
}) => {
	const [isCollapsed, toggleCollapsed] = useState<boolean>(true);

	const { pageWidth } = usePageWidth();

	const initialVisibleAttributesCount: number = useMemo(() => {
		const isTablet = pageWidth > 628 && pageWidth < 896;
		const isMobile = pageWidth <= 628;

		if (isMobile) return PROPOSAL_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT.MOBILE;
		if (isTablet) return PROPOSAL_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT.TABLET;
		return PROPOSAL_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT.DESKTOP;
	}, [pageWidth]);

	const isConcluded = moment(proposal.end).isBefore(moment());
	const { time: timeRemaining } = useTimer(
		proposal.end,
		isConcluded ? null : DEFAULT_TIMMER_INTERVAL,
	);

	const attributes: ProposalAttribute[] = useMemo(() => {
		if (!dao || !proposal) {
			return [];
		}

		let parsedAttributes = [
			{
				label: 'Status',
				value: formatProposalStatus(proposal),
			},
			{
				label: 'Time Remaining',
				value: secondsToDhms(timeRemaining / 1000) || '-',
			},
			{
				label: 'Voting Started',
				value: formatDateTime(proposal.start, 'M/D/YYYY h:mm A Z') || '-',
			},
			{
				label: isConcluded ? 'Voting Ended' : 'Voting Ends',
				value: formatDateTime(proposal.end, 'M/D/YYYY h:mm A Z') || '-',
			},
			{
				label: 'Voting System',
				value: 'Weighted Single Choice Voting',
			},
			{
				label: 'Execution Criteria',
				value: 'Absolute Majority',
			},
			{
				label: 'Votes Submitted',
				value: proposal.votes.toString(),
			},
			{
				label: 'Creator',
				value: <EtherscanLink address={proposal.author} />,
			},
		];

		if (isFromSnapshotWithMultipleChoices(proposal)) {
			parsedAttributes = parsedAttributes.slice(1);
		}

		return parsedAttributes.filter(
			({ value }) => !isEmpty(value) && value !== '-',
		);
	}, [dao, proposal, isConcluded, timeRemaining]);

	const initialHiddenAttributesCount: number = Math.max(
		attributes.length - initialVisibleAttributesCount,
		0,
	);

	const visibleAttributes: ProposalAttribute[] = useMemo(() => {
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
				{visibleAttributes.map(
					(attribute: ProposalAttribute, index: number) => (
						<li
							className={`${styles.Attribute} ${
								index > 10 ? styles.SetOpacityAnimation : ''
							}`}
							key={index}
						>
							<span className={styles.Traits}>{attribute.label}</span>
							<span className={styles.Properties}>{attribute.value} </span>
						</li>
					),
				)}

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
