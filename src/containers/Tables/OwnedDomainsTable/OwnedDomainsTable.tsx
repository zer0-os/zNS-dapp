/* eslint-disable react-hooks/exhaustive-deps */
// React Imports
import React, { useState } from 'react';

//- Web3 Imports
import { useWeb3React } from '@web3-react/core'; // Wallet data
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider'; // Wallet data

//- Library Imports
import { useZnsContracts } from 'lib/contracts';
import { useApprovals } from 'lib/hooks/useApprovals';
import { useDomainsOwnedByUserQuery } from 'lib/hooks/zNSDomainHooks';

// Type Imports
import { Bid, Domain, DomainData } from 'lib/types';

//- Component Imports
import { DomainTable, Overlay, Spinner } from 'components';

//- Containers Imports
import { BidList, AcceptBid } from 'containers';

//- Constants
import {
	NO_ERROR,
	FAILED_TO_APPROVE,
	LOADING_DOMAINS_LABEL,
} from './constants';

//- Utils
import { AcceptBidModalData, OwnedDomainTableProps } from './utils';

//- Style Imports
import styles from './OwnedDomainsTable.module.scss';

const OwnedDomainTables: React.FC<OwnedDomainTableProps> = ({ onNavigate }) => {
	//////////////////
	// State & Data //
	//////////////////

	// zAuction Integrations
	const { approveAllTokens, isApprovedForAllTokens } = useApprovals();
	const znsContracts = useZnsContracts()!;
	const zAuctionAddress = znsContracts.zAuction.address;
	// Wallet Integrations
	const walletContext = useWeb3React<Web3Provider>();
	const { account, active } = walletContext;
	// Queries
	const ownedDomainPollingInterval: number = 5000;
	const ownedQuery = useDomainsOwnedByUserQuery(
		account!,
		ownedDomainPollingInterval,
	);
	const owned = ownedQuery.data?.domains;

	// Accepting Bid Data
	const [acceptingBid, setAcceptingBid] = React.useState<
		AcceptBidModalData | undefined
	>();

	// Domain Data
	const [viewingDomain, setViewingDomain] = React.useState<
		DomainData | undefined
	>();

	// Loading States
	const [isTableLoading, setIsTableLoading] = React.useState(true);
	const [isGridView, setIsGridView] = React.useState(false);
	const [error, setError] = useState('');

	///////////////
	// Functions //
	///////////////

	// Domain Table Functions
	const rowClick = (domain: Domain) => {
		if (onNavigate) onNavigate(domain.name);
	};

	const isButtonActive = (row: any[]) => {
		return row.length > 0;
	};

	const tableLoaded = () => {
		setIsTableLoading(false);
	};

	const viewBid = async (domain: DomainData) => {
		setViewingDomain(domain);
	};

	const closeDomain = () => setViewingDomain(undefined);

	const closeAcceptBid = () => {
		setAcceptingBid(undefined);
		setError(NO_ERROR);
	};

	const isApproved = async () => {
		const approved = await isApprovedForAllTokens({
			owner: account as string,
			operator: zAuctionAddress,
		});
		return approved;
	};

	const accept = async (bid: Bid) => {
		if (!viewingDomain?.domain || !bid) return;
		setAcceptingBid({
			domain: viewingDomain.domain,
			bid: bid,
		});
		const shouldApprove = !(await isApproved());
		if (shouldApprove) {
			try {
				const approvedSuccess = await approve();
				if (approvedSuccess) throw Error(FAILED_TO_APPROVE);
			} catch (e: any) {
				closeAcceptBid();
			}
		}
	};

	const approve = async () => {
		const approved = await approveAllTokens({
			operator: zAuctionAddress,
			approved: true,
		});
		return approved;
	};

	/////////////////////
	// React Fragments //
	/////////////////////

	// Render nothing if wallet disconnected or no domains owned
	if (!active || !owned) return <></>;

	const overlays = () => (
		<>
			{acceptingBid !== undefined && (
				<Overlay onClose={closeAcceptBid} centered open>
					<AcceptBid
						onClose={closeAcceptBid}
						setViewingDomain={setViewingDomain}
						acceptingBid={acceptingBid}
						znsContracts={znsContracts}
						zAuctionAddress={zAuctionAddress}
						ownedQuery={ownedQuery}
						error={error}
						setError={setError}
						userId={account || undefined}
					/>
				</Overlay>
			)}
			{viewingDomain !== undefined && (
				<Overlay onClose={closeDomain} centered open>
					<BidList
						bids={viewingDomain.bids}
						onAccept={accept}
						// isAccepting={isAccepting}
					/>
				</Overlay>
			)}
		</>
	);

	return (
		<>
			{overlays()}
			{isTableLoading && (
				<>
					<p className={styles.Message}>{LOADING_DOMAINS_LABEL}</p>
					<Spinner style={{ margin: '8px auto' }} />
				</>
			)}
			<DomainTable
				className={styles.Reset}
				domains={owned}
				isButtonActive={isButtonActive}
				filterOwnBids={true}
				isRootDomain={false}
				ignoreAspectRatios={true}
				rowButtonText={'View Bids'}
				onLoad={tableLoaded}
				onButtonClick={viewBid}
				onRowClick={rowClick}
				isGridView={isGridView}
				setIsGridView={(grid: boolean) => setIsGridView(grid)}
				userId={account || undefined}
				style={{ display: isTableLoading ? 'none' : 'inline-block' }}
			/>
		</>
	);
};

export default OwnedDomainTables;
