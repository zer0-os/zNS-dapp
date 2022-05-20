import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

// - Library
import { zDAO, ProposalId } from '@zero-tech/zdao-sdk';

// - Hooks
import { useDidMount } from 'lib/hooks/useDidMount';
import { useWillUnmount } from 'lib/hooks/useWillUnmount';
import useProposal from '../../hooks/useProposal';

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
	useDidMount(() => {
		document.getElementById('dao-page-nav-tabs')!.style.display = 'none';
	});

	useWillUnmount(() => {
		document.getElementById('dao-page-nav-tabs')!.style.display = 'block';
	});

	const history = useHistory();
	const { proposalId } = useParams<{ proposalId: ProposalId }>();

	const { proposal, isLoading, votes, isLoadingVotes } = useProposal(
		proposalId as ProposalId,
		dao,
	);

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

						<VoteBar scores={proposal?.scores} />

						<VoteAttributes proposal={proposal} votes={votes} />

						<MarkDownViewer
							text={proposal?.body}
							className={styles.MarkDownViewerContent}
						/>

						<VoteHistories
							proposal={proposal}
							isLoading={isLoadingVotes}
							votes={votes}
						/>
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
