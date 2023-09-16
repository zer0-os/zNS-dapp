import React from 'react';

// - Library
import classNames from 'classnames';

// - Hooks
import { useCreateProposal } from './hooks';

// - Component
import { ConnectToWallet, FutureButton, Overlay } from 'components';

// - Styles
import styles from './CreateProposal.module.scss';

type CreateProposalNotesProps = Pick<
	ReturnType<typeof useCreateProposal>,
	'isLoading' | 'notes' | 'showWalletConnectModal' | 'handleHideConnectWallet'
>;

export const CreateProposalNotes: React.FC<CreateProposalNotesProps> = ({
	notes,
	showWalletConnectModal,
	handleHideConnectWallet,
}) => {
	return (
		<div className={styles.Notes}>
			{/* Connect Wallet Note */}
			{notes.ConnectWallet.show && (
				<div className={styles.Notes_Section}>
					<div className={styles.Notes_Section_Note}>
						Please connect a Web3 wallet to create a proposal
					</div>
					<div className={styles.Notes_Section_Action}>
						<FutureButton glow onClick={notes.ConnectWallet.onClick}>
							Connect Wallet
						</FutureButton>
					</div>
				</div>
			)}

			{/* Token Empty Note */}
			{notes.Token.show && (
				<div className={styles.Notes_Section}>
					<div
						className={classNames(
							styles.Notes_Section_Note,
							styles.Notes_Section_Note_Warning,
						)}
					>
						You cannot create a proposal as this DAO does not hold any ERC20
						tokens.
					</div>
					<div className={styles.Notes_Section_Note}>
						Proposals are currently limited to funding proposals (where DAO
						ERC20 tokens are sent to a recipient, if the proposal is approved).
						Please check the assets tab of the DAO.
					</div>
					<div className={styles.Notes_Section_Action}>
						<FutureButton glow onClick={notes.Token.onClick}>
							Back To Dao
						</FutureButton>
					</div>
				</div>
			)}

			{showWalletConnectModal && (
				<Overlay centered open onClose={handleHideConnectWallet}>
					<ConnectToWallet onConnect={handleHideConnectWallet} />
				</Overlay>
			)}
		</div>
	);
};
