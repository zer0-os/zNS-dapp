import React, { useCallback } from 'react';
import { useHistory, useLocation } from 'react-router-dom';

// Lib
import { formatTotalAmountOfTokenMetadata } from './ProposalsTable.helpers';

// Styles
import classNames from 'classnames';
import styles from './ProposalsTableRow.module.scss';

// Types
import { Proposal, TokenMetaData } from '@zero-tech/zdao-sdk';

interface ProposalsTableRowProps {
	data: Proposal;
	onRowClick?: () => void;
	className: string;
}

/**
 * A single row item for the Proposals table
 */
// TODO:: should be styled and get token metadata and format the ammount (cc @Joon)
// TODO:: should implement timer with "end" date time (cc @Joon)
const ProposalsTableRow: React.FC<ProposalsTableRowProps> = ({
	data,
	onRowClick,
	className,
}) => {
	const history = useHistory();
	const location = useLocation();

	const { id, title, state } = data;

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
			<td>{title}</td>

			{/* Status */}
			<td>{state}</td>

			{/* Closes with humanized format */}
			<td>{'2h 39mins'}</td>

			{/* Total amount of tokens */}
			<td className={styles.Right}>
				{/* {formatTotalAmountOfTokenMetadata({
					amount: "100,000",
					decimals: 100000
				} as TokenMetaData)} */}
			</td>
		</tr>
	);
};

export default ProposalsTableRow;
