import React, { useMemo, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

// - Library
import type { zDAO, ProposalId } from '@zero-tech/zdao-sdk';
import { cloneDeep } from 'lodash';
import { isFromSnapshotWithMultipleChoices } from '../Proposals.helpers';

// - Hooks
import { useDidMount } from 'lib/hooks/useDidMount';
import { useWillUnmount } from 'lib/hooks/useWillUnmount';
import useProposal from '../../hooks/useProposal';

// - Component
import { ArrowLeft } from 'react-feather';
import { LoadingIndicator, MarkDownViewer } from 'components';
import { VoteBar } from './VoteBar';
import { ProposalAttributes } from './ProposalAttributes';
import { VoteHistories } from './VoteHistories';

// - Styles
import styles from './ProposalDetail.module.scss';
import Vote from './Vote/Vote';

type ProposalDetailProps = {
	dao?: zDAO;
};

export const ProposalDetail: React.FC<ProposalDetailProps> = ({ dao }) => {
	const [triggerRefresh, setTriggerRefresh] = useState<boolean>(false);

	useDidMount(() => {
		const nav = document.getElementById('dao-page-nav-tabs');
		if (nav) {
			nav.style.display = 'none';
		}
	});

	useWillUnmount(() => {
		const nav = document.getElementById('dao-page-nav-tabs');
		if (nav) {
			nav.style.display = 'block';
		}
	});

	const history = useHistory();
	const { proposalId } = useParams<{ proposalId: ProposalId }>();

	const { proposal, isLoading, votes, isLoadingVotes } = useProposal(
		proposalId as ProposalId,
		dao,
		triggerRefresh,
	);

	const refresh = () => {
		setTriggerRefresh(!triggerRefresh);
	};

	const toAllProposals = useMemo(() => {
		const pathname = history.location.pathname.replace(`/${proposalId}`, '');
		const state = cloneDeep(history.location.state);

		return {
			pathname,
			state,
		};
	}, [history, proposalId]);

	return (
		<div className={styles.Container}>
			<Link className={styles.NavLink} to={toAllProposals}>
				<ArrowLeft /> All Proposals
			</Link>

			<div className={styles.Content}>
				{isLoading && <LoadingIndicator text="" />}

				{!isLoading && (
					<div className={styles.Wrapper}>
						<h1 className={styles.Title}>{proposal?.title}</h1>

						{proposal &&
							!isFromSnapshotWithMultipleChoices(proposal) &&
							votes?.length > 0 && <VoteBar votes={votes} />}

						{dao && proposal && (
							<ProposalAttributes dao={dao} proposal={proposal} />
						)}

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

			{!isLoading && proposal && (
				<Vote proposal={proposal} onCompleteVoting={refresh} />
			)}
		</div>
	);
};

export default ProposalDetail;
