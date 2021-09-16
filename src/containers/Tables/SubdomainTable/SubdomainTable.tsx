/*
	This is a container for rendering a subdomain
	on the *current* domain.

	It is rendered in ZNS.tsx - domain name is passed
	from react-router in App.tsx
 */

// React Imports
import { useHistory } from 'react-router-dom';
import { useCallback } from 'react';

// Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';

// Library Imports
import { Domain } from 'lib/types';
import { getDomainId } from 'lib/utils';
import { useZnsDomain } from 'lib/hooks/useZnsDomain';

// Component Imports
import { DomainTable } from 'components';

type SubdomainTableProps = {
	isGridView: boolean;
	setIsGridView: (grid: boolean) => void;
	domainName: string;
};

const SubdomainTable = (props: SubdomainTableProps) => {
	// Navigation data
	const { push: goTo } = useHistory();

	// Web3 hook data
	const walletContext = useWeb3React<Web3Provider>();
	const { account } = walletContext;

	// Domain hook data
	const domainId = getDomainId(props.domainName.substring(1));
	const znsDomain = useZnsDomain(domainId);
	const loading = znsDomain.loading;
	const subdomains = znsDomain?.domain?.subdomains;

	const onRowClick = useCallback((domain: Domain) => {
		if (domain.name.startsWith('wilder.')) {
			goTo(domain.name.split('wilder.')[1]);
		} else {
			goTo(domain.name);
		}
	}, []);

	return (
		<DomainTable
			domains={subdomains || []}
			isRootDomain={props.domainName === '/'}
			isGlobalTable
			style={{ marginTop: 16 }}
			empty={!loading && (!subdomains || subdomains?.length === 0)}
			disableButton={!account}
			isGridView={props.isGridView}
			setIsGridView={props.setIsGridView}
			userId={account as string}
			onRowClick={onRowClick}
		/>
	);
};

export default SubdomainTable;
