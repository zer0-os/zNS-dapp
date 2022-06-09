import React from 'react';
import { useLocation } from 'react-router-dom';
import { get } from 'lodash';
import type { Proposal } from '@zero-tech/zdao-sdk';
import { LoadingIndicator, GenericTable } from 'components';
import ProposalsTableRow from './ProposalsTableRow';
import ProposalsTableCard from './ProposalsTableCard';
import {
	PROPOSAL_TABLE_LOCATION_STATE_KEY,
	PROPOSAL_TABLE_LOCATION_STATE,
} from '../Proposals.constants';
import styles from './ProposalsTable.module.scss';

type ProposalsTableProps = {
	proposals?: Proposal[];
	isLoading: boolean;
	isReloading: boolean;
};

const HEADERS = [
	{
		label: 'Title',
		accessor: '',
		className: '',
	},
	{
		label: 'Status',
		accessor: '',
		className: '',
	},
	{
		label: 'Closes',
		accessor: '',
		className: '',
	},
	{
		label: 'Votes',
		accessor: '',
		className: '',
	},
];

const ProposalsTable: React.FC<ProposalsTableProps> = ({
	proposals,
	isLoading,
	isReloading,
}) => {
	const location = useLocation();

	const isGridViewByDefault =
		get(
			location.state,
			PROPOSAL_TABLE_LOCATION_STATE_KEY,
			PROPOSAL_TABLE_LOCATION_STATE.ROW,
		) === PROPOSAL_TABLE_LOCATION_STATE.CARD;

	return (
		<div className={styles.Container}>
			{isReloading && <LoadingIndicator className={styles.Loading} text="" />}

			<GenericTable
				alignments={[0, 0, 0, 1]}
				data={proposals}
				itemKey={'id'}
				infiniteScroll
				headers={HEADERS}
				rowComponent={ProposalsTableRow}
				gridComponent={ProposalsTableCard}
				isLoading={isLoading}
				loadingText={'Loading Proposals'}
				searchKey={['title', 'author']}
				searchBy={'proposal title'}
				emptyText={'This DAO has no proposals.'}
				isSingleGridColumn
				isGridViewByDefault={isGridViewByDefault}
			/>
		</div>
	);
};

export default ProposalsTable;
