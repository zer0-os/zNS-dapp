import { useZnsContracts } from 'lib/contracts';
import { tryFunction } from 'lib/utils';
import React from 'react';

interface CheckApproveHook {
	tokenOperator: string | null;
	approvedForAllTokens: boolean | null;
}

export function useApprovals(
	owner: string | null,
	operator: string | null,
	tokenId: number | null,
): CheckApproveHook {
	const [tokenOperator, setTokenOperator] = React.useState<string | null>(null);
	const [approvedForAllTokens, setApprovedForAllTokens] = React.useState<
		boolean | null
	>(null);

	const registry = useZnsContracts()?.registry;

	React.useEffect(() => {
		if (!registry) {
			throw Error(`no registry`);
		}

		const fetchApprovesFromContract = async () => {
			if (tokenId !== null) {
				const approvedAddress = await registry?.getApproved(tokenId);
				setTokenOperator(approvedAddress);
			}
			if (owner !== null && operator !== null) {
				const isApproved = await registry!.isApprovedForAll(owner, operator);
				setApprovedForAllTokens(isApproved);
			}
		};

		fetchApprovesFromContract();
	}, [owner, operator, tokenId]);

	return {
		tokenOperator,
		approvedForAllTokens,
	};
}
