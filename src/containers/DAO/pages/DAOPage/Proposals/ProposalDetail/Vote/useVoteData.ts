import { useCallback, useEffect, useState } from 'react';
import { Choice, Proposal } from '@zero-tech/zdao-sdk';
import { find } from 'lodash';

type UseVoteDataReturn = {
	isLoading: boolean;
	userVote: Choice | undefined;
	userVotingPower: number | undefined;
};

const useVoteData = (proposal?: Proposal, user?: string): UseVoteDataReturn => {
	const [userVote, setUserVote] = useState<Choice | undefined>();
	const [userVotingPower, setUserVotingPower] = useState<number | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	const getVotes = useCallback(async () => {
		setIsLoading(true);
		setUserVote(undefined);
		setUserVotingPower(undefined);

		/* Batch the API calls */
		const promises: Promise<any>[] = [proposal!.listVotes()];
		if (user) {
			promises.push(proposal!.getVotingPowerOfUser(user));
		}
		const [votes, power] = await Promise.all(promises);
		const vote = find(
			votes,
			(vote) => vote.voter.toLowerCase() === user!.toLowerCase(),
		);
		setUserVote(vote?.choice);
		setUserVotingPower(power);
		setIsLoading(false);
	}, [proposal, user]);

	useEffect(() => {
		if (proposal && user) {
			getVotes();
		}
	}, [proposal, user, getVotes]);

	return { isLoading, userVote, userVotingPower };
};

export default useVoteData;
