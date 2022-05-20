import React from 'react';
import { Proposal } from '@zero-tech/zdao-sdk';
import ProposalsTable from './PropsalsTable/ProposalsTable';

type ProposalsProps = {
	proposals?: Proposal[];
	isLoading: boolean;
};

export const Proposals: React.FC<ProposalsProps> = ({
	proposals,
	isLoading,
}) => {
	return <ProposalsTable proposals={proposals} isLoading={isLoading} />;
};

export default Proposals;
