import { Proposal, TokenMetaData } from '@zero-tech/zdao-sdk';
import { useEffect, useState } from 'react';

type UseProposalMetadataReturn = {
	metadata?: TokenMetaData;
	isLoading: boolean;
};

const useProposalMetadata = (
	proposal?: Proposal,
): UseProposalMetadataReturn => {
	const [metadata, setMetadata] = useState<TokenMetaData | undefined>();
	const [isLoading, setIsLoading] = useState<boolean>(true);

	useEffect(() => {
		setMetadata(undefined);
		setIsLoading(true);
		proposal
			?.getTokenMetadata()
			.then((m: TokenMetaData) => {
				setMetadata(m);
			})
			.catch((e) => {
				console.error(e);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [proposal]);

	return {
		metadata,
		isLoading,
	};
};

export default useProposalMetadata;
