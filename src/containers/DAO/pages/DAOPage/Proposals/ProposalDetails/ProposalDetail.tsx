import React from 'react';
import { Link, useHistory, useParams } from 'react-router-dom';
import { zDAO, ProposalId } from '@zero-tech/zdao-sdk';
import { ArrowLeft } from 'react-feather';
import useProposal from '../../hooks/useProposal';

type ProposalDetailProps = {
	dao?: zDAO;
};

// TODO:: Styling and add components cc @Eric
export const ProposalDetail: React.FC<ProposalDetailProps> = ({ dao }) => {
	const history = useHistory();
	const { proposalId } = useParams<{ proposalId: ProposalId }>();
	const { proposal, isLoading } = useProposal(proposalId as ProposalId, dao);

	return (
		<div>
			<Link to="#" onClick={history.goBack}>
				<ArrowLeft /> All Proposals
			</Link>
			{isLoading && <p>... Loading proposal - {proposalId} </p>}
			<h1>{proposal?.title}</h1>
			<p>{proposal?.body}</p>

			<div>
				{/* TODO:: This is Footer component cc @Brett */}
				Footer
			</div>
		</div>
	);
};

export default ProposalDetail;
