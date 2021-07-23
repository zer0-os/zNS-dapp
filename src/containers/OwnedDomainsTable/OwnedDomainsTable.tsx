// React Imports
import React from 'react';

// Library Imports
import { useDomainCache } from 'lib/useDomainCache';

// Type Imports
import { Bid, Domain, DomainHighestBid } from 'lib/types';

// Style Imports
import styles from './OwnedDomainsTable.module.css';

// Component Imports
import { Confirmation, DomainTable, Overlay } from 'components';

type AcceptBidModalData = {
	domain: Domain;
	bid: Bid;
};

const OwnedDomainTables = () => {
	const [isGridView, setIsGridView] = React.useState(false);
	const [acceptingBid, setAcceptingBid] = React.useState<
		AcceptBidModalData | undefined
	>();

	const { owned } = useDomainCache();

	const viewBid = (domain: DomainHighestBid) => {
		setAcceptingBid(domain);
	};

	const closeBid = () => {
		setAcceptingBid(undefined);
	};

	const acceptBidConfirmed = () => {
		// console.log(acceptingBid);
	};

	if (owned.isNothing()) return <></>;

	const modals = () => {};

	return (
		<>
			<Overlay onClose={closeBid} centered open={acceptingBid !== undefined}>
				<p>hello</p>
			</Overlay>
			<DomainTable
				className={styles.Reset}
				domains={owned.value.sort((a: any, b: any) => a.name - b.name)}
				isRootDomain={false}
				empty={true}
				rowButtonText={'Accept Highest Bid'}
				onRowButtonClick={viewBid}
				isGridView={isGridView}
				setIsGridView={(grid: boolean) => setIsGridView(grid)}
			/>
		</>
	);
};

export default OwnedDomainTables;
