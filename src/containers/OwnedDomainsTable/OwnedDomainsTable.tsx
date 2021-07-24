// React Imports
import React from 'react';

// Library Imports
import { useDomainCache } from 'lib/useDomainCache';
import { useZnsContracts } from 'lib/contracts';
import { useBidProvider } from 'lib/providers/BidProvider';
import { useApprovals } from 'lib/hooks/useApprovals';
import { useWeb3React } from '@web3-react/core';

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
	//////////////////
	// State & Data //
	//////////////////

	// Wallet Integrations
	const { account } = useWeb3React();
	const { owned } = useDomainCache();

	// zAuction Integrations
	const { approveAllTokens, isApprovedForAllTokens } = useApprovals();
	const znsContracts = useZnsContracts()!;
	const { acceptBid } = useBidProvider();
	const wildToken = znsContracts.wildToken;
	const zAuctionAddress = znsContracts.zAuction.address;

	// State
	const [isTableLoading, setIsTableLoading] = React.useState(true);
	const [tokensApproved, setTokensApproved] = React.useState<
		boolean | undefined
	>();
	const [isAccepting, setIsAccepting] = React.useState(false);
	const [isGridView, setIsGridView] = React.useState(false);
	const [acceptingBid, setAcceptingBid] = React.useState<
		AcceptBidModalData | undefined
	>();

	///////////////
	// Functions //
	///////////////

	const viewBid = async (domain: DomainHighestBid) => {
		if (!domain.bid || !account) return;
		setAcceptingBid(domain);

		const shouldApprove = !(await isApproved());
		setTokensApproved(!shouldApprove);
		if (shouldApprove) {
			try {
				const approvedSuccess = await approve();
				if (approvedSuccess) throw Error('failed to approve');
				setTokensApproved(true);
			} catch (e: any) {
				closeBid();
			}
		}
	};

	const isApproved = async () => {
		const approved = await isApprovedForAllTokens({
			owner: account as string,
			operator: zAuctionAddress,
		});
		return approved;
	};

	const approve = async () => {
		const approved = await approveAllTokens({
			operator: zAuctionAddress,
			approved: true,
		});
		return approved;
	};

	const closeBid = () => {
		setAcceptingBid(undefined);
	};

	const acceptBidConfirmed = async () => {
		if (!acceptingBid) return;
		setIsAccepting(true);
		await acceptBid(acceptingBid.bid);
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

	/////////////////////
	// React Fragments //
	/////////////////////

	const canPlaceBid = () => (
		<p>
			{acceptingBid!.bid.amount} WILD for {acceptingBid!.domain.name}
		</p>
	);

	const loadingState = () => <Spinner style={{ margin: '8px auto' }} />;

	const bidPending = () => (
		<>
			<p>Pending</p>
			<Spinner style={{ margin: '8px auto' }} />
		</>
	);

	const approving = () => (
		<>
			<p>Your wallet needs to approve zAuction to accept this bid</p>
			<Spinner style={{ margin: '8px auto' }} />
		</>
	);

	return (
		<>
			{acceptingBid !== undefined && (
				<Overlay onClose={closeBid} centered open>
					<Confirmation
						title={`Accept bid`}
						onConfirm={acceptBidConfirmed}
						onCancel={closeBid}
						hideButtons={tokensApproved !== true || isAccepting}
					>
						{tokensApproved === undefined && loadingState()}
						{tokensApproved === false && approving()}
						{tokensApproved && !isAccepting && canPlaceBid()}
						{tokensApproved && isAccepting && bidPending()}
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
