// import RequestActions from './components/RequestActions';
import { NFTCard, FutureButton } from 'components';
import { useTableProvider } from './RequestTableProvider';
// Library Imports
import { ethers } from 'ethers';

import styles from './RequestActions.module.css';

const RequestTableCard = (props: any) => {
	
	//////////////////
	//  Props //
	//////////////////
	const { contents, request } = props.data;
	const { view } = useTableProvider();

	///////////////
	// Functions //
	///////////////

	const dateFromTimestamp = (timestamp: string) =>
		new Date(Number(timestamp) * 1000).toLocaleString();

	const offerStatusAsText = () => {
		const needsApproval = !request.approved;
		const needsFulfillment = !request.fulfilled;

		if (needsApproval) return 'Offer made';
		if (needsFulfillment) return 'Offer approved';
		return 'Offer fulfilled';
	};

	///////////////
	// Fragments//
	///////////////

	const RequestActions = () => {
		return (
			<div className={styles.Container}>
				<span
					className={styles.Status}
					style={{
						color: request.approved
							? 'var(--color-success)'
							: 'var(--color-primary-lighter-3)',
					}}
				>
					{offerStatusAsText()}
				</span>
				<span className={`glow-text-blue ${styles.Amount}`}>
					{Number(
						ethers.utils.formatEther(request.offeredAmount),
					).toLocaleString()}{' '}
					{contents.stakeCurrency}
				</span>
				<span className={styles.Date}>
					{dateFromTimestamp(request.timestamp)}
				</span>
				<FutureButton
					className={styles.Button}
					glow
					onClick={() => view(request.domain)}
				>
					View Offer
				</FutureButton>
			</div>
		);
	};

      ///////////
	 // Render /
	///////////

	return (
		<>
			{request && (
				<NFTCard
					onClick={() => view(request.domain)}
					actionsComponent={<RequestActions />}
					metadataUrl={contents.metadata}
					domain={request.domain}
					price={100}
					nftOwnerId={contents.requestor}
					nftMinterId={contents.requestor}
					showCreator
					showOwner
					style={{ width: 380 }}
				/>
			)}
		</>
	);
};

export default RequestTableCard;
