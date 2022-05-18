import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

// - Library
import { zDAO, ProposalId } from '@zero-tech/zdao-sdk';

// - Hooks
import useProposal from '../../hooks/useProposal';
import useProposalMetadata from '../../hooks/useProposalMetadata';

// - Component
import { ArrowLeft } from 'react-feather';
import { LoadingIndicator, MarkDownViewer } from 'components';
import { VoteBar } from './VoteBar';
import { VoteAttributes } from './VoteAttributes';
import { VoteHistories } from './VoteHistories';

// - Styles
import styles from './ProposalDetail.module.scss';

type ProposalDetailProps = {
	dao?: zDAO;
};

export const ProposalDetail: React.FC<ProposalDetailProps> = ({ dao }) => {
	const history = useHistory();
	const { proposalId } = useParams<{ proposalId: ProposalId }>();

	const { proposal, isLoading: isProposalLoading } = useProposal(
		proposalId as ProposalId,
		dao,
	);
	const { metadata, isLoading: isMetadataLoading } =
		useProposalMetadata(proposal);

	const isLoading = isProposalLoading || isMetadataLoading;

	return (
		<div className={styles.Container}>
			<Link className={styles.NavLink} to="#" onClick={history.goBack}>
				<ArrowLeft /> All Proposals
			</Link>

			<div className={styles.Content}>
				{isLoading && <LoadingIndicator text="" />}

				{!isLoading && (
					<div className={styles.Wrapper}>
						<h1 className={styles.Title}>{proposal?.title}</h1>

						<VoteBar value1={75} value2={25} />

						<VoteAttributes proposal={proposal} metadata={metadata} />

						<MarkDownViewer text={proposal?.body} />

						<VoteHistories proposal={proposal} metadata={metadata} />
					</div>
				)}
			</div>

			{!isLoading && (
				<div>
					{/* TODO:: This is Footer component cc @Brett */}
					Footer
				</div>
			)}
		</div>
	);
};

export default ProposalDetail;
