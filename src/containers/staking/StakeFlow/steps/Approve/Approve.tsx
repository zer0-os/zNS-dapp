import { FutureButton, Spinner } from 'components';

import styles from './Approve.module.scss';

export enum ApprovalStep {
	Prompt,
	WaitingForWallet,
	Approving,
}

type ApproveProps = {
	error?: string;
	step: ApprovalStep;
};

const Approve = (props: ApproveProps) => {
	const { error, step } = props;

	const view = () => {
		if (step === ApprovalStep.Prompt || error) {
			return (
				<>
					<p>
						Before you can stake in this pool, your wallet needs to approve pool
						spending. You will only need to do this once per pool. This will
						cost gas.
					</p>
					{error && <p className="error-text">{error}</p>}
					<div className={styles.Buttons}>
						<FutureButton glow alt onClick={() => {}}>
							Cancel
						</FutureButton>
						<FutureButton glow onClick={() => {}}>
							Continue
						</FutureButton>
					</div>
				</>
			);
		} else if (step === ApprovalStep.WaitingForWallet) {
			return (
				<>
					<p>
						Before you can stake in this pool, your wallet needs to approve pool
						spending. You will only need to do this once per pool. This will
						cost gas.
					</p>
					<p>Please accept in your wallet...</p>
					<Spinner />
				</>
			);
		} else if (step === ApprovalStep.Approving) {
			return (
				<>
					<p>
						Approving pool spending... This may take up to 20 mins. This
						transaction must finish before you can continue to stake in this
						pool.
					</p>
					<Spinner />
				</>
			);
		}
	};

	return <div className={styles.Container}>{view()}</div>;
};

export default Approve;
