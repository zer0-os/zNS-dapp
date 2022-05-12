import React from 'react';
import { zDAO } from '@zero-tech/zdao-sdk';
import useProposals from '../hooks/useProposals';
import ProposalsTable from './PropsalsTable/ProposalsTable';

type ProposalsProps = {
	dao?: zDAO;
};

export const Proposals: React.FC<ProposalsProps> = ({ dao }) => {
	const { proposals, isLoading } = useProposals(dao);

	return <ProposalsTable proposals={proposals} isLoading={isLoading} />;
};

export default Proposals;
