// Component Imports
import { FutureButton } from 'components';

// Library Imports
import { ethers } from 'ethers';
import { DomainRequestAndContents } from 'lib/types';

// Style Imports
import styles from './RequestActions.module.css';

type RequestActionsProps = {
	onClick: (domainName: string) => void;
	request: DomainRequestAndContents;
};

const RequestActions: React.FC<RequestActionsProps> = ({
	onClick,
	request,
}) => {
	///////////////
	// Functions //
	///////////////

	const dateFromTimestamp = (timestamp: string) =>
		new Date(Number(timestamp) * 1000).toLocaleString();

	const offerStatusAsText = () => {
		const needsApproval = !request.request.approved;
		const needsFulfillment = !request.request.fulfilled;

		if (needsApproval) return 'Offer made';
		if (needsFulfillment) return 'Offer approved';
		return 'Offer fulfilled';
	};

	////////////
	// Render //
	////////////
	return (
		<div className={styles.Container}>
			<span
				className={styles.Status}
				style={{
					color: request.request.approved
						? 'var(--color-success)'
						: 'var(--color-primary-lighter-3)',
				}}
			>
				{offerStatusAsText()}
			</span>
			<span className={`glow-text-blue ${styles.Amount}`}>
				{Number(
					ethers.utils.formatEther(request.request.offeredAmount),
				).toLocaleString()}{' '}
				{request.contents.stakeCurrency}
			</span>
			<span className={styles.Date}>
				{dateFromTimestamp(request.request.timestamp)}
			</span>
			<FutureButton
				className={styles.Button}
				glow
				onClick={() => onClick(request.request.domain)}
			>
				View Offer
			</FutureButton>
		</div>
	);
};

export default RequestActions;
