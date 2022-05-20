import React, { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

// Hooks
import useProposalMetadata from '../../hooks/useProposalMetadata';
import useCurrency from 'lib/hooks/useCurrency';
import useTimer from 'lib/hooks/useTimer';

// Lib
import moment from 'moment';
import { truncateString } from 'lib/utils/string';
import {
	formatProposalStatus,
	formatProposalEndTime,
	formatTotalAmountOfTokenMetadata,
	formatAmountInUSDOfTokenMetadata,
} from '../Proposals.helpers';

// Components
import { LoadingIndicator } from 'components';

// Styles
import classNames from 'classnames/bind';
import styles from './ProposalsTableRow.module.scss';

// Types
import { Proposal } from '@zero-tech/zdao-sdk';

// Constants
import { DEFAULT_TIMMER_INTERVAL } from '../Proposals.constants';
import { CURRENCY } from 'constants/currency';

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

	const { metadata, isLoading: isMetadataLoading } = useProposalMetadata(data);

	const { wildPriceUsd } = useCurrency(false);

	const { id, title, state, end } = data;

	const isConcluded = moment(end).isBefore(moment());

	const { time } = useTimer(end, isConcluded ? null : DEFAULT_TIMMER_INTERVAL);

	const amount = useMemo(() => {
		const wild = formatTotalAmountOfTokenMetadata(metadata);
		const usd = formatAmountInUSDOfTokenMetadata(wildPriceUsd, metadata);

		return {
			wild: wild ? wild + ' ' + CURRENCY.WILD : '',
			usd: usd ?? '',
		};
	}, [metadata, wildPriceUsd]);

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
		history.push(`${location.pathname}/${id}`);
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
				{isMetadataLoading ? (
					<LoadingIndicator text="" className={styles.LoadingMetadata} />
				) : (
					<>
						<p>{amount.wild}</p>
						<p>{amount.usd}</p>
					</>
				)}
			</td>
		</tr>
	);
};

export default ProposalsTableRow;
