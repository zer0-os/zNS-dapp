// React Imports
import React from 'react';

// Library Imports
import { useZnsContracts } from 'lib/contracts';
import { useBidProvider } from 'lib/providers/BidProvider';
import { useApprovals } from 'lib/hooks/useApprovals';
import { useWeb3React } from '@web3-react/core';

// Type Imports
import { Bid, Domain } from 'lib/types';

// Component Imports
import { Confirmation, Overlay, Spinner, GenericTable } from 'components';
import { BidList } from 'containers';
import { useDomainsOwnedByUserQuery } from 'lib/hooks/zNSDomainHooks';
import OwnedDomainTableRow from './OwnedDomainTableRow';
import OwnedDomainTableCard from './OwnedDomainTableCard';
import OwnedDomainTableProvider, {
	useTableProvider,
} from './OwnedDomainTableProvider';

type AcceptBidModalData = {
	domain: Domain;
	bid: Bid;
};

type OwnedDomainTableProps = {
	onNavigate?: (to: string) => void;
};

const OwnedDomainTables = ({ onNavigate }: OwnedDomainTableProps) => {
	//////////////////
	// State & Data //
	//////////////////

	// Wallet Integrations
	const { account } = useWeb3React();
	const ownedDomainPollingInterval: number = 5000;
	const ownedQuery = useDomainsOwnedByUserQuery(
		account!,
		ownedDomainPollingInterval,
	);
	const owned = ownedQuery.data?.domains;

	// zAuction Integrations
	const { approveAllTokens, isApprovedForAllTokens } = useApprovals();
	const znsContracts = useZnsContracts()!;
	const { acceptBid } = useBidProvider();
	const zAuctionAddress = znsContracts.zAuction.address;

	// State
	const [tokensApproved, setTokensApproved] = React.useState<
		boolean | undefined
	>();
	const [isAccepting, setIsAccepting] = React.useState(false);
	const [acceptingBid, setAcceptingBid] = React.useState<
		AcceptBidModalData | undefined
	>();

	///////////////
	// Functions //
	///////////////

	const { setViewingDomainState, viewingDomain } = useTableProvider();

	const accept = async (bid: Bid) => {
		if (!viewingDomain?.domain || !bid) return;
		setAcceptingBid({
			domain: viewingDomain.domain,
			bid: bid,
		});

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

	const closeBid = () => setAcceptingBid(undefined);

	const closeDomain = () => setViewingDomainState(undefined);

	const acceptBidConfirmed = async () => {
		if (!acceptingBid) {
			return;
		}
		setIsAccepting(true);
		const tx = await acceptBid(acceptingBid.bid);
		if (tx) {
			await tx.wait();
		}
		setTimeout(() => {
			//refetch after confirm the transaction, with a delay to wait until backend gets updated
			ownedQuery.refetch();
		}, 500);
		setIsAccepting(false);
		setAcceptingBid(undefined);
	};

	if (!owned) return <></>;

	/////////////////////
	// React Fragments //
	/////////////////////

	const canPlaceBid = () => {
		const id = acceptingBid!.bid.bidderAccount;
		return (
			<p style={{ fontSize: 14, fontWeight: 400, lineHeight: '21px' }}>
				Are you sure you want to accept the bid of{' '}
				<b className="glow-text-white">
					{acceptingBid!.bid.amount.toLocaleString()} WILD
				</b>{' '}
				tokens by{' '}
				<b>
					<a
						className="alt-link"
						href={`https://etherscan.io/address/${id}`}
						target="_blank"
						rel="noreferrer"
					>
						{id.substring(0, 4)}...{id.substring(id.length - 4)}
					</a>
				</b>
				? You will receive{' '}
				<b className="glow-text-white">
					{acceptingBid!.bid.amount.toLocaleString()} WILD
				</b>{' '}
				tokens in exchange for ownership of{' '}
				<b className="glow-text-white">0://{acceptingBid!.domain.name}</b>
			</p>
		);
	};

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

	const overlays = () => (
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
			{viewingDomain !== undefined && (
				<Overlay onClose={closeDomain} centered open>
					<BidList bids={viewingDomain!.bids} onAccept={accept} />
				</Overlay>
			)}
		</>
	);

	return (
		<>
			{overlays()}
			<GenericTable
				alignments={[0, 0, 1, 1, 1]}
				headers={['', 'DOMAIN', 'HIGHEST BID', '# OF BIDS', '']}
				data={owned}
				loadingText={'Loading Domains'}
				rowComponent={OwnedDomainTableRow}
				gridComponent={OwnedDomainTableCard}
				filterOwnBids={true}
			/>
		</>
	);
};

const WrappedOwnedDomainTable = ({ onNavigate }: OwnedDomainTableProps) => {
	return (
		<OwnedDomainTableProvider onNavigate={onNavigate}>
			<OwnedDomainTables onNavigate={onNavigate} />
		</OwnedDomainTableProvider>
	);
};

export default React.memo(WrappedOwnedDomainTable);
