// React Imports
import React from 'react';

// Library Imports
import { useDomainCache } from 'lib/useDomainCache';
import { useBidProvider } from 'lib/providers/BidProvider';

// Type Imports
import { Bid, Domain, DomainHighestBid } from 'lib/types';

// Style Imports
import styles from './OwnedDomainsTable.module.css';

// Component Imports
import { Confirmation, DomainTable, Overlay, Spinner } from 'components';

type AcceptBidModalData = {
	domain: Domain;
	bid: Bid;
};

const OwnedDomainTables = () => {
	const { acceptBid } = useBidProvider();

	const [isTableLoading, setIsTableLoading] = React.useState(true);
	const [isAccepting, setIsAccepting] = React.useState(false);
	const [isGridView, setIsGridView] = React.useState(false);
	const [acceptingBid, setAcceptingBid] = React.useState<
		AcceptBidModalData | undefined
	>();

	const { owned } = useDomainCache();

	const viewBid = (domain: DomainHighestBid) => {
		if (!domain.bid) return;
		setAcceptingBid(domain);
	};

	const closeBid = () => {
		setAcceptingBid(undefined);
	};

	const acceptBidConfirmed = async () => {
		if (!acceptingBid) return;
		setIsAccepting(true);
		await acceptBid(acceptingBid.domain.id, acceptingBid.bid.amount);
		setIsAccepting(false);
		setAcceptingBid(undefined);
	};

	const rowClick = (domain: Domain) => {};

	const isButtonActive = (row: any[]) => {
		return row.length > 0;
	};

	const tableLoaded = () => {
		setIsTableLoading(false);
	};

	if (owned.isNothing()) return <></>;

	const modals = () => {};

	return (
		<>
			{acceptingBid !== undefined && (
				<Overlay onClose={closeBid} centered open>
					<Confirmation
						title={`Accept bid`}
						onConfirm={acceptBidConfirmed}
						onCancel={closeBid}
						hideButtons={isAccepting}
					>
						{!isAccepting && (
							<p>
								{acceptingBid.bid.amount} WILD for {acceptingBid.domain.name}
							</p>
						)}
						{isAccepting && (
							<>
								<p>Pending</p>
								<Spinner style={{ margin: '8px auto' }} />
							</>
						)}
					</Confirmation>
				</Overlay>
			)}
			{isTableLoading && (
				<>
					<p className={styles.Message}>Loading Your Domains</p>
					<Spinner style={{ margin: '8px auto' }} />
				</>
			)}
			<DomainTable
				className={styles.Reset}
				domains={owned.value.sort((a: any, b: any) => a.name - b.name)}
				isButtonActive={isButtonActive}
				isRootDomain={false}
				empty={true}
				rowButtonText={'Accept Bid'}
				onLoad={tableLoaded}
				onRowButtonClick={viewBid}
				onRowClick={rowClick}
				isGridView={isGridView}
				setIsGridView={(grid: boolean) => setIsGridView(grid)}
				style={{ display: isTableLoading ? 'none' : 'inline-block' }}
			/>
		</>
	);
};

export default OwnedDomainTables;
