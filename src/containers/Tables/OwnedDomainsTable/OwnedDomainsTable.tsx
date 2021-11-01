// React Imports
import React, { useEffect, useState } from 'react';

// Library Imports
import { useZnsContracts } from 'lib/contracts';
import { useBidProvider } from 'lib/providers/BidProvider';
import { useApprovals } from 'lib/hooks/useApprovals';
import { useWeb3React } from '@web3-react/core';
import { ethers } from 'ethers';
import { ERC20 } from 'types';

// Type Imports
import { Bid, Domain, DomainData, Maybe } from 'lib/types';

// Style Imports
import styles from './OwnedDomainsTable.module.scss';

// Component Imports
import {
	Confirmation,
	DomainTable,
	FutureButton,
	LoadingIndicator,
	Overlay,
	Spinner,
	StepBar,
} from 'components';
import { BidList } from 'containers';
import { useDomainsOwnedByUserQuery } from 'lib/hooks/zNSDomainHooks';

type AcceptBidModalData = {
	domain: Domain;
	bid: Bid;
};

enum Steps {
	Approve,
	Confirm,
	Accept,
}

type OwnedDomainTableProps = {
	onNavigate?: (to: string) => void;
};

const OwnedDomainTables: React.FC<OwnedDomainTableProps> = ({ onNavigate }) => {
	//////////////////
	// State & Data //
	//////////////////

	// zAuction Integrations
	const { approveAllTokens, isApprovedForAllTokens } = useApprovals();
	const znsContracts = useZnsContracts()!;
	const { acceptBid } = useBidProvider();
	const zAuctionAddress = znsContracts.zAuction.address;

	// Wallet Integrations
	const { account, active } = useWeb3React();
	const ownedDomainPollingInterval: number = 5000;
	const ownedQuery = useDomainsOwnedByUserQuery(
		account!,
		ownedDomainPollingInterval,
	);
	const owned = ownedQuery.data?.domains;
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
	const [step, setStep] = useState<Steps>(Steps.Approve);
	const [error, setError] = useState('');
	const [isMetamaskWaiting, setIsMetamaskWaiting] = useState(false);
	const [isApprovalInProgress, setIsApprovalInProgress] = useState(false);
	const [isCheckingAllowance, setIsCheckingAllowance] = useState(false);
	const [hasApprovedTokenTransfer, setHasApprovedTokenTransfer] = useState<
		boolean | undefined
	>();
	const [statusText, setStatusText] = useState<string>('Processing bid');

	///////////////
	// Functions //
	///////////////

	// Wizard Step 1/3
	const approveZAuction = async () => {
		setStatusText('Ensuring you have enough gas to approve zAuction...');
		setError(``);
		setIsApprovalInProgress(true);

		// try {
		// 	const gasRequired = await wildContract.estimateGas.approve(
		// 		zAuctionAddress,
		// 		ethers.constants.MaxUint256,
		// 	);
		// 	const gasPrice = await wildContract.signer.getGasPrice();
		// 	const userBalance = await wildContract.signer.getBalance();

		// 	const totalPrice = gasPrice.mul(gasRequired);
		// 	if (userBalance.lt(totalPrice)) {
		// 		setError(`You don't have enough Ether to use as gas`);
		// 		setIsApprovalInProgress(false);
		// 		return;
		// 	}
		// } catch (e) {
		// 	console.error(e);
		// 	setError(`Failed to calculate gas costs. Please try again later.`);
		// 	setIsApprovalInProgress(false);
		// 	return;
		// }

		setStatusText(
			'Before you can accept a bid, your wallet needs to approve zAuction. You will only need to do this once. This will incur gas fees.' +
				'Please accept in your wallet...',
		);

		let tx: Maybe<ethers.ContractTransaction>;

		try {
			tx = await wildContract.approve(
				zAuctionAddress,
				ethers.constants.MaxUint256,
			);
		} catch (e) {
			console.error(e);
			if (e.code === 4001) {
				setError(`Approval rejected by wallet`);
			} else {
				setError(`Failed to submit transaction.`);
			}
			setIsApprovalInProgress(false);
			return;
		}

		setStatusText('Waiting for approval transaction to be confirmed.');
		try {
			await tx.wait();
		} catch (e) {
			setError(`Transaction failed, try again later.`);
			console.error(e);

			setIsApprovalInProgress(false);
			return;
		}

		setHasApprovedTokenTransfer(true);
		setIsApprovalInProgress(false);
	};

	// Wizard Step 2/3
	// TODO
	// Wizard Step 3/3
	// TODO

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
		setAcceptingBid(undefined);
		setError('');
	};

	const closeDomain = () => setViewingDomain(undefined);

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

	const rowClick = (domain: Domain) => {
		if (onNavigate) onNavigate(domain.name);
	};

	const isButtonActive = (row: any[]) => {
		return row.length > 0;
	};

	const tableLoaded = () => {
		setIsTableLoading(false);
	};

	if (!owned) return <></>; // Render nothing if no domains owned

	/////////////////////
	// React Fragments //
	/////////////////////

	if (!active) return <></>; // Render nothing if wallet disconnected

	const approveStep = () => {
		let errorMessage: Maybe<React.ReactFragment>;

		if (error) {
			errorMessage = (
				<p
					style={{ textAlign: 'center', marginTop: '16px' }}
					className={styles.Error}
				>
					{error}
				</p>
			);
		}

		return (
			<div
				className={styles.Section}
				style={{
					display: 'flex',
					flexDirection: 'column',
					padding: '0 16px',
					textAlign: 'center',
				}}
			>
				{!isMetamaskWaiting && !isApprovalInProgress && !isCheckingAllowance && (
					<>
						{!hasApprovedTokenTransfer && (
							<>
								<p style={{ lineHeight: '24px' }}>
									Before you can accept a bid, your wallet needs to approve
									zAuction. You will only need to do this once. This will incur
									gas fees.
								</p>
								{errorMessage}

								<div className={styles.CTAContainer}>
									<div>
										<FutureButton
											glow
											alt
											style={{
												height: 36,
												width: 140,
												borderRadius: 18,
												textTransform: 'uppercase',
												margin: '16px auto 0 auto',
											}}
											onClick={closeBid}
										>
											Cancel
										</FutureButton>
									</div>
									<div>
										<FutureButton
											glow
											style={{
												height: 36,
												width: 140,
												borderRadius: 18,
												textTransform: 'uppercase',
												margin: '16px auto 0 auto',
											}}
											onClick={approveZAuction}
										>
											Continue
										</FutureButton>
									</div>
								</div>
							</>
						)}
					</>
				)}
				{isCheckingAllowance && (
					<>
						<LoadingIndicator
							style={{ marginTop: 24 }}
							text="Checking status of zAuction approval"
						/>
					</>
				)}
				{isApprovalInProgress && (
					<>
						<LoadingIndicator style={{ marginTop: 24 }} text={statusText} />
					</>
				)}
			</div>
		);
	};

	// const canPlaceBid = () => {
	// 	const id = acceptingBid!.bid.bidderAccount;
	// 	return (
	// 		<p style={{ fontSize: 14, fontWeight: 400, lineHeight: '21px' }}>
	// 			Are you sure you want to accept the bid of{' '}
	// 			<b className="glow-text-white">
	// 				{acceptingBid!.bid.amount.toLocaleString()} WILD
	// 			</b>{' '}
	// 			tokens by{' '}
	// 			<b>
	// 				<a
	// 					className="alt-link"
	// 					href={`https://etherscan.io/address/${id}`}
	// 					target="_blank"
	// 					rel="noreferrer"
	// 				>
	// 					{id.substring(0, 4)}...{id.substring(id.length - 4)}
	// 				</a>
	// 			</b>
	// 			? You will receive{' '}
	// 			<b className="glow-text-white">
	// 				{acceptingBid!.bid.amount.toLocaleString()} WILD
	// 			</b>{' '}
	// 			tokens in exchange for ownership of{' '}
	// 			<b className="glow-text-white">0://{acceptingBid!.domain.name}</b>
	// 		</p>
	// 	);
	// };

	// const loadingState = () => <Spinner style={{ margin: '8px auto' }} />;

	// const bidPending = () => (
	// 	<>
	// 		<p>Pending</p>
	// 		<Spinner style={{ margin: '8px auto' }} />
	// 	</>
	// );

	// const approving = () => (
	// 	<>
	// 		<p>Your wallet needs to approve zAuction to accept this bid</p>
	// 		<Spinner style={{ margin: '8px auto' }} />
	// 	</>
	// );

	const header = () => (
		<>
			<div className={styles.Header}>
				<h1 className={`glow-text-white`}>Approve zAuction</h1>
			</div>
		</>
	);

	const overlays = () => (
		<>
			{acceptingBid !== undefined && (
				<Overlay onClose={closeBid} centered open>
					<div
						className={`${styles.Container} border-primary border-rounded blur`}
					>
						{header()}
						<StepBar
							step={step + 1}
							steps={['zAuction Check', 'Confirm', 'Accept']}
							onNavigate={(i: number) => setStep(i)}
						/>
						{step === Steps.Approve && approveStep()}
						{/* {step === Steps.Confirm && approveStep()}
						{step === Steps.Accept && confirmStep()} */}
					</div>
					{/* <Confirmation
						title={`Accept bid`}
						onConfirm={acceptBidConfirmed}
						onCancel={closeBid}
						hideButtons={tokensApproved !== true || isAccepting}
					>
						{tokensApproved === undefined && loadingState()}
						{tokensApproved === false && approving()}
						{tokensApproved && !isAccepting && canPlaceBid()}
						{tokensApproved && isAccepting && bidPending()}
					</Confirmation> */}
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
				onRowButtonClick={viewBid}
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
