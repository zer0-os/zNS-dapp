import React from 'react';
import ProposalsTable from './PropsalsTable/ProposalsTable';
import { useDidMount } from 'lib/hooks/useDidMount';
import { useProposals } from 'lib/dao/providers/ProposalsProvider';

export const Proposals: React.FC = () => {
	const { proposals, isInitialFetching, isRefetching, fetch } = useProposals();

	useDidMount(fetch);

	return (
		<ProposalsTable
			proposals={proposals}
			isLoading={isInitialFetching}
			isReloading={isRefetching}
		/>
	);
};

export default Proposals;
