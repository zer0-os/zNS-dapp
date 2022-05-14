import React, { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

// Hooks
import useProposalMetadata from '../../hooks/useProposalMetadata';
import useCurrency from 'lib/hooks/useCurrency';
import useTimer from 'lib/hooks/useTimer';

// Lib
import moment from 'moment';
import {
	formatProposalEndTime,
	formatTotalAmountOfTokenMetadata,
	formatAmountInUSDOfTokenMetadata,
} from './ProposalsTable.helpers';

// Components
import { LoadingIndicator } from 'components';

// Styles
import classNames from 'classnames';
import styles from './ProposalsTableRow.module.scss';

// Types
import { Proposal } from '@zero-tech/zdao-sdk';

// Constants
import { DEFAULT_TIMMER_INTERVAL } from './ProposalsTable.constants';
import { CURRENCY } from 'constants/currency';

interface ProposalsTableRowProps {
	data: Proposal;
	onRowClick?: () => void;
	className: string;
}

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
			<td className={styles.Title}>{title}</td>

			{/* Status */}
			<td className={styles.Status}>{state}</td>

			{/* Closes with humanized format */}
			<td className={styles.Timer}>{formatProposalEndTime(time)}</td>

			{/* Total amount of tokens */}
			<td className={styles.Amount}>
				{isMetadataLoading ? (
					<LoadingIndicator text="" />
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
