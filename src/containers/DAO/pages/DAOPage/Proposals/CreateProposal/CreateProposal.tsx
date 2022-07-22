import React from 'react';
import { Link } from 'react-router-dom';

// - Library
import type { zDAO } from '@zero-tech/zdao-sdk';

// - Component
import { ArrowLeft } from 'react-feather';
import { LoadingIndicator } from 'components';
import { CreateProposalForm } from './CreateProposalForm';
import { CreateProposalNotes } from './CreateProposalNotes';

// - Hooks
import { useCreateProposal } from './hooks';

// - Styles
import styles from './CreateProposal.module.scss';

type CreateProposalProps = {
	dao?: zDAO;
};

export const CreateProposal: React.FC<CreateProposalProps> = ({ dao }) => {
	const {
		isLoading,
		notes,
		triggerCancel,
		showWalletConnectModal,
		showForm,
		tokenDropdownOptions,
		handleGoToAllProposals,
		handleHideConnectWallet,
	} = useCreateProposal(dao);

	return (
		<>
			<div className={styles.Container}>
				<Link
					className={styles.NavLink}
					to={'#'}
					onClick={handleGoToAllProposals}
				>
					<ArrowLeft /> All Proposals
				</Link>

				<div className={styles.Content}>
					{/* Page Title */}
					<h1 className={styles.Title}>Create a Proposal</h1>

					{/* Loading Spinner */}
					{isLoading && <LoadingIndicator text="" />}

					{/* Notes */}
					{notes.show && (
						<CreateProposalNotes
							isLoading={isLoading}
							notes={notes}
							showWalletConnectModal={showWalletConnectModal}
							handleHideConnectWallet={handleHideConnectWallet}
						/>
					)}

					{/* Form */}
					{showForm && (
						<CreateProposalForm
							dao={dao}
							triggerCancel={triggerCancel}
							tokenDropdownOptions={tokenDropdownOptions}
						/>
					)}
				</div>
			</div>
		</>
	);
};
