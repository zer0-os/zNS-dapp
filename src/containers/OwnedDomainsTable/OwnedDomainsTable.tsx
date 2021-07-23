// React Imports
import React from 'react';

// Library Imports
import { useDomainCache } from 'lib/useDomainCache';

// Style Imports
import styles from './OwnedDomainsTable.module.css';

// Component Imports
import { DomainTable } from 'components';

const OwnedDomainTables = () => {
	const [isGridView, setIsGridView] = React.useState(false);

	const { owned } = useDomainCache();

	if (owned.isNothing()) return <></>;

	return (
		<>
			<DomainTable
				className={styles.Reset}
				domains={owned.value}
				isRootDomain={false}
				empty={true}
				isGridView={isGridView}
				setIsGridView={(grid: boolean) => setIsGridView(grid)}
			/>
		</>
	);
};

export default OwnedDomainTables;
