// React Imports
import React from 'react';

// Library Imports
import { useZnsContracts } from 'lib/contracts';
import { useBidProvider } from 'lib/providers/BidProvider';
import { useApprovals } from 'lib/hooks/useApprovals';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';

// Type Imports
import { Bid, Domain, DomainData } from 'lib/types';

// Style Imports
import styles from './OwnedDomainsTable.module.scss';

// Component Imports
import { Confirmation, DomainTable, Overlay, Spinner } from 'components';
import { BidList } from 'containers';
import { useDomainsOwnedByUserQuery } from 'lib/hooks/zNSDomainHooks';
import { ERC20 } from 'types';

type AcceptBidModalData = {
	domain: Domain;
	bid: Bid;
};

type OwnedDomainTableProps = {
	onNavigate?: (to: string) => void;
};

const OwnedDomainTables: React.FC<OwnedDomainTableProps> = ({ onNavigate }) => {
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
	const wildContract: ERC20 = znsContracts.wildToken;

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
	const [viewingDomain, setViewingDomain] = React.useState<
		DomainData | undefined
	>();
	const [errorWhileAccepting, setErrorWhileAccepting] = React.useState<
		string | undefined
	>();
	const [statusText, setStatusText] = React.useState<string | undefined>();

	///////////////
	// Functions //
	///////////////

	const viewBid = async (domain: DomainData) => {
		setViewingDomain(domain);
	};

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

	const closeBid = () => {
		setIsAccepting(false);
		setAcceptingBid(undefined);
		setErrorWhileAccepting(undefined);
	};

	const closeDomain = () => setViewingDomain(undefined);

	const acceptBidConfirmed = async () => {
		if (!acceptingBid) {
			return;
		}
		try {
			setIsAccepting(true);
			setErrorWhileAccepting(undefined);

			const { bidderAccount, amount: bidAmount } = acceptingBid.bid;

			// Check bidder has sufficient balance
			setStatusText("Checking bidder's WILD balance");
			const bidAsWei = ethers.utils.parseEther(bidAmount.toString());
			const checkBalance = await wildContract.balanceOf(bidderAccount);
			const bidderHasInsufficientBalance = checkBalance.lt(bidAsWei);

			if (bidderHasInsufficientBalance) {
				throw new Error('Bidder has insufficient balance');
			}

			try {
				// Wrapping a try around this as acceptBid doesn't throw any
				// descriptive errors (yet)
				setStatusText('Waiting for wallet approval');
				const tx = await acceptBid(acceptingBid.bid);
				if (tx) {
					setStatusText('Processing transaction');
					await tx.wait();
				}
			} catch {
				throw new Error('Failed to accept bid');
			}

			setTimeout(() => {
				//refetch after confirm the transaction, with a delay to wait until backend gets updated
				ownedQuery.refetch();
			}, 500);
			setIsAccepting(false);
			setAcceptingBid(undefined);
		} catch (e) {
			setErrorWhileAccepting((e as Error).message || 'Failed to accept bid');
			setIsAccepting(false);
		}
		setStatusText(undefined);
	};

	const rowClick = (domain: Domain) => {
		if (onNavigate) onNavigate(`/market/${domain.name.replace('wilder.', '')}`);
	};

	const isButtonActive = (row: any[]) => {
		return row.length > 0;
	};

	const tableLoaded = () => {
		setIsTableLoading(false);
	};

	if (!owned) return <></>;

	/////////////////////
	// React Fragments //
	/////////////////////

	const canPlaceBid = () => {
		const id = acceptingBid!.bid.bidderAccount;
		return (
			<>
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
				{errorWhileAccepting && (
					<p style={{ fontWeight: 400, padding: 0 }} className="error-text">
						{errorWhileAccepting}
					</p>
				)}
			</>
		);
	};

	const loadingState = () => <Spinner style={{ margin: '8px auto' }} />;

	const bidPending = () => (
		<>
			<p>{statusText || 'Pending'}</p>
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
					<BidList bids={viewingDomain.bids} onAccept={accept} />
				</Overlay>
			)}
		</>
	);

	return (
		<>
			{overlays()}
			{isTableLoading && (
				<>
					<p className={styles.Message}>Loading Your Domains</p>
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
