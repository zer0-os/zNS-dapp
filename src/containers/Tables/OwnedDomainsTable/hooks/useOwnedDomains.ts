import { Domain } from '@zero-tech/zns-sdk';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';
import { useEffect, useState } from 'react';

type UseOwnedDomainsReturn = {
	isLoading: boolean;
	ownedDomains?: Domain[];
};

const useOwnedDomains = (
	account: string | undefined | null,
): UseOwnedDomainsReturn => {
	const { instance: sdk } = useZnsSdk();

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [ownedDomains, setOwnedDomains] = useState<Domain[] | undefined>();

	useEffect(() => {
		setOwnedDomains(undefined);
		if (!account) {
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		sdk
			.getDomainsByOwner(account)
			.then((owned) => {
				setOwnedDomains(owned);
				setIsLoading(false);
			})
			.catch((e) => {
				console.error(e);
				setIsLoading(false);
			});
	}, [account, sdk]);

	return {
		isLoading,
		ownedDomains,
	};
};

export default useOwnedDomains;
