import { LoadingIndicator } from 'components';
import { Confirm, Header } from '../../../';

import styles from './Approve.module.scss';

export enum ApprovalStep {
	Prompt,
	WaitingForWallet,
	Approving,
	Checking,
}

type ApproveProps = {
	onContinue: () => void;
	onCancel: () => void;
	error?: string;
	step: ApprovalStep;
};

const Approve = (props: ApproveProps) => {
	const { onContinue, onCancel, error, step } = props;

	const view = () => {
		if (step === ApprovalStep.Checking) {
			return (
				<LoadingIndicator
					text={<p>Checking status of pool spending approval...</p>}
				/>
			);
		} else if (step === ApprovalStep.Prompt || error) {
			return (
				<Confirm
					content={
						<p>
							Before you can stake in this pool, your wallet needs to approve
							pool spending. You will only need to do this once per pool. This
							will cost gas.
						</p>
					}
					confirmText={'Continue'}
					onConfirm={onContinue}
					onCancel={onCancel}
				/>
			);
		} else if (step === ApprovalStep.WaitingForWallet) {
			return (
				<LoadingIndicator
					text={
						<>
							<p>
								Before you can stake in this pool, your wallet needs to approve
								pool spending. You will only need to do this once per pool. This
								will cost gas.
							</p>
							<p>Please accept in your wallet...</p>
						</>
					}
				/>
			);
		} else if (step === ApprovalStep.Approving) {
			return (
				<LoadingIndicator
					text={
						<p>
							Approving pool spending... This may take up to 20 minutes. This
							transaction must finish before you can continue to stake in this
							pool.
						</p>
					}
				/>
			);
		}
	};

	return (
		<>
			<Header text="Approve Pool Spending" />
			<div className={styles.Container}>{view()}</div>
		</>
	);
};

export default Approve;
