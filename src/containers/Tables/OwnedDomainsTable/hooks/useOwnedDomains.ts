import { Domain } from '@zero-tech/zns-sdk';
import { useDidMount } from 'lib/hooks/useDidMount';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useZnsSdk } from 'lib/hooks/sdk';
import { useRef, useState } from 'react';

type UseOwnedDomainsReturn = {
	isLoading: boolean;
	ownedDomains?: Domain[];
	refetch: () => void;
};

const useOwnedDomains = (
	account: string | undefined | null,
): UseOwnedDomainsReturn => {
	const isMounted = useRef<boolean>();
	const { instance: sdk } = useZnsSdk();

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [ownedDomains, setOwnedDomains] = useState<Domain[] | undefined>();

	const getOwnedDomains = () => {
		setOwnedDomains(undefined);
		if (!account) {
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		sdk
			.getDomainsByOwner(account)
			.then((owned) => {
				if (isMounted.current) {
					setOwnedDomains(owned);
					setIsLoading(false);
				}
			})
			.catch((e) => {
				if (isMounted.current) {
					console.error(e);
					setIsLoading(false);
				}
			});
	};

	useUpdateEffect(getOwnedDomains, [account, sdk]);

	useDidMount(() => {
		isMounted.current = true;
		getOwnedDomains();
		return () => {
			isMounted.current = false;
		};
	});

	return {
		isLoading,
		ownedDomains,
		refetch: getOwnedDomains,
	};
};

export default useOwnedDomains;
