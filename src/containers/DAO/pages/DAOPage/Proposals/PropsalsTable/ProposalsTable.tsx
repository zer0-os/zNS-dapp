import React from 'react';
import { Proposal } from '@zero-tech/zdao-sdk';
import { GenericTable } from 'components';
import ProposalsTableRow from './ProposalsTableRow';
import ProposalsTableCard from './ProposalsTableCard';

type ProposalsTableProps = {
	proposals?: Proposal[];
	isLoading: boolean;
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
		label: 'Amount',
		accessor: '',
		className: '',
	},
];

const ProposalsTable: React.FC<ProposalsTableProps> = ({
	proposals,
	isLoading,
}) => {
	return (
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
		/>
	);
};

export default ProposalsTable;
