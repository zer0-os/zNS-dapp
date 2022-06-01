import React, { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

// Hooks
import { useCurrentDao } from 'lib/dao/providers/CurrentDaoProvider';
import useTimer from 'lib/hooks/useTimer';

// Lib
import moment from 'moment';
import { sum } from 'lodash';
import { truncateString } from 'lib/utils/string';
import {
	formatProposalStatus,
	formatProposalEndTime,
} from '../Proposals.helpers';

// Components
import { LoadingIndicator } from 'components';

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
	const history = useHistory();
	const location = useLocation();

	const { dao, isLoading: isDaoLoading } = useCurrentDao();

	const { id, title, end, scores } = data;

	const isConcluded = moment(end).isBefore(moment());

	const { time } = useTimer(end, isConcluded ? null : DEFAULT_TIMMER_INTERVAL);

	const closingStatus = useMemo(() => {
		let status = 'normal';
		if (!isConcluded && time < 24 * 3600 * 1000) {
			// less than 1 hour
			status = 'error';
		} else if (!isConcluded && time <= 24 * 3600 * 1000) {
			// less than 1 day
			status = 'warning';
		}

		return status;
	}, [isConcluded, time]);

	const handleRowClick = useCallback(() => {
		history.push(`${location.pathname}/${id}`, {
			[PROPOSAL_TABLE_LOCATION_STATE_KEY]: PROPOSAL_TABLE_LOCATION_STATE.ROW,
		});
		onRowClick && onRowClick();
	}, [onRowClick, history, location, id]);

	return (
		<tr
			className={classNames(styles.Container, className)}
			onClick={handleRowClick}
		>
			{/* Title */}
			<td className={styles.Title}>{truncateString(title, 150)}</td>

			{/* Status */}
			<td className={styles.Status}>{formatProposalStatus(data)}</td>

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

			{/* Total amount of tokens */}
			<td className={styles.Amount}>
				{isDaoLoading ? (
					<LoadingIndicator text="" className={styles.LoadingDao} />
				) : (
					<p>{sum(scores) + ' ' + dao?.votingToken.symbol}</p>
				)}
			</td>
		</tr>
	);
};

export default ProposalsTableRow;
