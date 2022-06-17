import React from 'react';
import ProposalsTable from './PropsalsTable/ProposalsTable';
import { useProposals } from 'lib/dao/providers/ProposalsProvider';

export const Proposals: React.FC = () => {
	const { proposals, isInitialFetching, isRefetching } = useProposals();

	return (
		<ProposalsTable
			proposals={proposals}
			isLoading={isInitialFetching}
			isReloading={isRefetching}
		/>
	);
};

export default Proposals;
