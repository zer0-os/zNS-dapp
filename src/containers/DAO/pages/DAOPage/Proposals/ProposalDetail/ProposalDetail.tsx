import React, { useMemo, useState } from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';

// - Library
import type { Proposal, ProposalId, zDAO } from '@zero-tech/zdao-sdk';
import { cloneDeep, isEqual } from 'lodash';
import {
	formatProposalBody,
	isFromSnapshotWithMultipleChoices,
} from '../Proposals.helpers';

// - Hooks
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { usePrevious } from 'lib/hooks/usePrevious';
import { useProposals } from 'lib/dao/providers/ProposalsProvider';
import useProposal from '../../hooks/useProposal';

// - Component
import { ArrowLeft } from 'react-feather';
import { LoadingIndicator, MarkDownViewer } from 'components';
import { VoteBar } from './VoteBar';
import Vote from './Vote/Vote';
import { ProposalAttributes } from './ProposalAttributes';
import { VoteHistories } from './VoteHistories';

// - Styles
import styles from './ProposalDetail.module.scss';

type ProposalDetailProps = {
	dao?: zDAO;
};

export const ProposalDetail: React.FC<ProposalDetailProps> = ({ dao }) => {
	const [triggerRefresh, setTriggerRefresh] = useState<boolean>(false);

	const history = useHistory();
	const { proposalId } = useParams<{ proposalId: ProposalId }>();

	const { proposal, isLoading, votes, isLoadingVotes } = useProposal(
		proposalId as ProposalId,
		dao,
		triggerRefresh,
	);
	const prevProposal = usePrevious<Proposal | undefined>(proposal);
	const { updateProposal } = useProposals();

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

	useUpdateEffect(() => {
		if (proposal && !isEqual(proposal, prevProposal)) {
			updateProposal(proposal);
		}
	}, [proposal, prevProposal]);

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
							text={formatProposalBody(proposal?.body)}
							className={styles.MarkDownViewerContent}
						/>

						<VoteHistories
							dao={dao}
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
