// Component Imports
import { FutureButton, Spinner } from 'components';
import React, { useState } from 'react';

// Style Imports
import styles from './Approval.module.scss';

const Approval = () => {
	// Is Checking Approval
	// Has Approved
	// Is Approving
	// Has Approval Failed

	const [isCheckingApproval, setIsCheckingApproval] = useState(true);
	const [hasApproved, setHasApproved] = useState<boolean | undefined>(false);
	const [isWaitingForConfirmation, setIsWaitingForConfirmation] =
		useState<boolean>(false);
	const [isApprovalInProgress, setIsApprovalInProgress] =
		useState<boolean>(false);
	const [error, setError] = useState<string | undefined>();

	const checkingApproval = () => {
		return (
			<>
				<span>Checking status of WILD Sales Contract...</span>
				<Spinner />
			</>
		);
	};

	const needsApproval = (error?: string) => {
		return (
			<>
				<span>
					Before you can mint a Crib, your wallet needs to approve WILD
					spending. You will only need to do this once. This will cost gas.
				</span>
				{error !== undefined && <span className="error-text">{error}</span>}
				<div className="option-buttons">
					<FutureButton alt glow onClick={() => console.log('hello')}>
						Cancel
					</FutureButton>
					<FutureButton glow onClick={() => console.log('hello')}>
						Continue
					</FutureButton>
				</div>
			</>
		);
	};

	const waitingForConfirmation = () => {
		return (
			<>
				<span>
					Before you can mint a Crib, your wallet needs to approve WILD
					spending. You will only need to do this once. This will cost gas.
				</span>

				<span>Please accept in your wallet...</span>
				<Spinner />
			</>
		);
	};

	const approvalInProgress = () => {
		return (
			<>
				<span>
					Approving WILD spending contract. This may take up to x mins. This
					transaction must finish before you can continue to mint your Crib.
				</span>
				<Spinner />
			</>
		);
	};

	const wrap = (content: React.ReactNode) => {
		return <section className={styles.Container}>{content}</section>;
	};

	if (isCheckingApproval) {
		return wrap(checkingApproval());
	} else if (isWaitingForConfirmation) {
		return wrap(waitingForConfirmation());
	} else if (isApprovalInProgress) {
		return wrap(approvalInProgress());
	} else if (!hasApproved) {
		return wrap(needsApproval(error));
	} else {
		return <></>;
	}
};

export default Approval;
