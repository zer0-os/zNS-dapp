import React, { useState, useMemo } from 'react';

// - Library
import moment from 'moment';
import { Proposal, TokenMetaData } from '@zero-tech/zdao-sdk';
import { capitalizeString } from 'lib/utils/string';
import { secondsToDhms, formatDateTime } from 'lib/utils/datetime';
import { formatTotalAmountOfTokenMetadata } from '../../PropsalsTable/ProposalsTable.helpers';
import { truncateWalletAddress } from 'lib/utils';

// - Types
import { VoteAttribute } from './VoteAttributes.types';

// Constants
import { CURRENCY } from 'constants/currency';
import { VOTE_ATTRIBUTES_VISIBLE_COUNTS_BY_VIEWPORT } from './VoteAttributes.constants';

//- Style Imports
import styles from './VoteAttributes.module.scss';

type VoteAttributesProps = {
	proposal?: Proposal;
	metadata?: TokenMetaData;
};

export const VoteAttributes: React.FC<VoteAttributesProps> = ({
	proposal,
	metadata,
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
		const result: VoteAttribute[] = [];

		if (!proposal || !metadata) {
			return result;
		}

		const wild = formatTotalAmountOfTokenMetadata(metadata);

		// TODO: Should align the attributes
		result.push({
			label: 'Status',
			value: capitalizeString(proposal.state),
		});

		result.push({
			label: 'Time Remaining',
			value: secondsToDhms(moment(proposal.end).diff(moment()) / 1000) || '-',
		});

		result.push({
			label: 'Type',
			value: capitalizeString(proposal.type),
		});

		result.push({
			label: 'Amount',
			value: wild ? wild + ' ' + CURRENCY.WILD : '-',
		});

		result.push({
			label: 'Voting Started',
			value: formatDateTime(proposal.start, 'M/D/YYYY h:m A Z') || '-',
		});

		result.push({
			label: 'Voting Ends',
			value: formatDateTime(proposal.start, 'M/D/YYYY h:m A Z') || '-',
		});

		result.push({
			label: 'Voting System',
			value: '-',
		});

		result.push({
			label: 'Execution Criteria',
			value: '-',
		});

		result.push({
			label: 'Creator',
			value: truncateWalletAddress(proposal.author, 4) || '-',
		});

		result.push({
			label: 'Source of Funds',
			value: '-',
		});

		result.push({
			label: 'Recipient',
			value: truncateWalletAddress(metadata.recipient, 4) || '-',
		});

		result.push({
			label: 'Votes Submitted',
			value: '-',
		});

		return result;
	}, [proposal, metadata]);

	const initialHiddenAttributesCount: number = useMemo(() => {
		if (attributes.length > initialVisibleAttributesCount) {
			return attributes.length - initialVisibleAttributesCount;
		}

		return 0;
	}, [attributes, initialVisibleAttributesCount]);

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
