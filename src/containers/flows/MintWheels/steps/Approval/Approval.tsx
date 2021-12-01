// Component Imports
import { FutureButton, Spinner } from 'components';
import React, { useEffect, useState } from 'react';

import { ERC20, WhitelistSimpleSale } from 'types';

import {
	getSaleContractApprovalStatus,
	approveSaleContract,
} from '../../helpers';

// Style Imports
import styles from './Approval.module.scss';

type ApprovalProps = {
	contract: WhitelistSimpleSale;
	token: ERC20;
	userId: string;
	onApproval: () => void;
	onCancel: () => void;
	onError: (error: string) => void;
};

const Approval: React.FC<ApprovalProps> = ({
	contract,
	token,
	userId,
	onApproval,
	onCancel,
	onError,
}) => {
	const [isCheckingApproval, setIsCheckingApproval] = useState(true);
	const [hasApproved, setHasApproved] = useState<boolean | undefined>(false);
	const [isWaitingForConfirmation, setIsWaitingForConfirmation] =
		useState<boolean>(false);
	const [isApprovalInProgress, setIsApprovalInProgress] =
		useState<boolean>(false);
	const [error, setError] = useState<string | undefined>();

	const checkContractApproval = () => {
		return new Promise((resolve, reject) => {
			getSaleContractApprovalStatus(userId, contract, token)
				.then((isApproved) => resolve(isApproved))
				.catch((e) => reject(e));
		});
	};

	const approve = () => {
		setIsWaitingForConfirmation(true);
		approveSaleContract(contract, token)
			.then(async (tx) => {
				try {
					setIsApprovalInProgress(true);
					setIsWaitingForConfirmation(false);
					await tx.wait();
					setHasApproved(true);
					onApproval();
				} catch (e) {
					setError(e.message);
					setIsWaitingForConfirmation(false);
					setIsApprovalInProgress(false);
				}
			})
			.catch((e) => {
				setError(e.message);
				setIsWaitingForConfirmation(false);
				setIsApprovalInProgress(false);
			});
	};

	useEffect(() => {
		// needs to sleep here for a couple seconds
		checkContractApproval()
			.then((isApproved) => {
				if (isApproved) {
					onApproval();
				} else {
					setIsCheckingApproval(false);
					setHasApproved(false);
				}
			})
			.catch((e) => {
				onError(e.message);
			});
	}, []);

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
					<FutureButton alt glow onClick={onCancel}>
						Cancel
					</FutureButton>
					<FutureButton glow onClick={approve}>
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
					Approving WILD spending contract. This may take a few minutes. This
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
