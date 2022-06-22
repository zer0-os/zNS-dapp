import React, { useCallback, useMemo, useState } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

// Hooks
import useTimer from 'lib/hooks/useTimer';
import { useDidMount } from 'lib/hooks/useDidMount';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { usePrevious } from 'lib/hooks/usePrevious';
import { useProposals } from 'lib/dao/providers/ProposalsProvider';

// Lib
import moment from 'moment';
import { isEqual } from 'lodash';
import { truncateString } from 'lib/utils/string';
import {
	formatProposalStatus,
	formatProposalEndTime,
} from '../Proposals.helpers';

// Styles
import classNames from 'classnames/bind';
import styles from './ProposalsTableRow.module.scss';

// Types
import type { Proposal } from '@zero-tech/zdao-sdk';

// Constants
import {
	DEFAULT_TIMMER_INTERVAL,
	PROPOSAL_TABLE_LOCATION_STATE_KEY,
	PROPOSAL_TABLE_LOCATION_STATE,
} from '../Proposals.constants';

interface ProposalsTableRowProps {
	data: Proposal;
	onRowClick?: () => void;
	className: string;
}

const cx = classNames.bind(styles);

/**
 * A single row item for the Proposals table
 */
const ProposalsTableRow: React.FC<ProposalsTableRowProps> = ({
	data,
	onRowClick,
	className,
}) => {
	/**
	 * Hooks and Data
	 */
	const { updateProposal } = useProposals();

	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [proposal, setProposal] = useState<Proposal>(data);
	const prevProposal = usePrevious<Proposal>(proposal);

	const history = useHistory();
	const location = useLocation();

	const isConcluded = moment(proposal.end).isBefore(moment());

	const { time } = useTimer(
		proposal.end,
		isConcluded ? null : DEFAULT_TIMMER_INTERVAL,
	);

	const closingStatus = useMemo(() => {
		let status = 'normal';
		if (!isConcluded && time < 1 * 3600 * 1000) {
			// less than 1 hour
			status = 'error';
		} else if (!isConcluded && time <= 24 * 3600 * 1000) {
			// less than 1 day
			status = 'warning';
		}

		return status;
	}, [isConcluded, time]);

	/**
	 * Callbacks
	 */
	const refetchProposalData = useCallback(async () => {
		if (proposal.state !== 'closed') {
			setIsLoading(true);
			try {
				const updatedProposal = await proposal.updateScoresAndVotes();
				setProposal(updatedProposal);
			} catch (e) {
				console.error(e);
			} finally {
				setIsLoading(false);
			}
		}
	}, [proposal, setProposal]);

	const handleRowClick = useCallback(() => {
		history.push(`${location.pathname}/${proposal.id}`, {
			[PROPOSAL_TABLE_LOCATION_STATE_KEY]: PROPOSAL_TABLE_LOCATION_STATE.ROW,
		});
		onRowClick && onRowClick();
	}, [onRowClick, history, location, proposal]);

	/**
	 * Life Cycle
	 */
	useDidMount(refetchProposalData);

	useUpdateEffect(() => {
		if (!isEqual(proposal, prevProposal)) {
			updateProposal(proposal);
		}
	}, [proposal, prevProposal]);

	useUpdateEffect(() => {
		if (isConcluded) {
			updateProposal(proposal);
		}
	}, [isConcluded]);

	return (
		<tr
			className={classNames(styles.Container, className)}
			onClick={handleRowClick}
		>
			{/* Title */}
			<td className={styles.Title}>{truncateString(proposal.title, 150)}</td>

			{/* Status */}
			<td className={styles.Status}>
				{formatProposalStatus(isLoading ? data : proposal)}
			</td>

			{/* Closes with humanized format */}
			<td
				className={cx(styles.Timer, {
					Concluded: isConcluded,
					Warning: closingStatus === 'warning',
					Error: closingStatus === 'error',
				})}
			>
				{formatProposalEndTime(time)}
			</td>

			{/* Total votes count of proposal */}
			<td className={styles.Votes}>
				<p>{isLoading ? data.votes : proposal.votes}</p>
			</td>
		</tr>
	);
};

export default ProposalsTableRow;
