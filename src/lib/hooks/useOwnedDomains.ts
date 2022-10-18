//- React Imports
import { useRef, useState } from 'react';

//- Library Imports
import { ConvertedTokenInfo, Domain } from '@zero-tech/zns-sdk';
import { useDidMount } from 'lib/hooks/useDidMount';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useZnsSdk } from 'lib/hooks/sdk';
import getPaymentTokenInfo from 'lib/paymentToken';

type UseOwnedDomainsReturn = {
	isLoading: boolean;
	ownedDomains?: (Domain & { paymentTokenInfo: ConvertedTokenInfo })[];
	refetch: () => void;
};

const useOwnedDomains = (
	account: string | undefined | null,
): UseOwnedDomainsReturn => {
	const isMounted = useRef<boolean>();
	const { instance: sdk } = useZnsSdk();

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [ownedDomains, setOwnedDomains] = useState<
		(Domain & { paymentTokenInfo: ConvertedTokenInfo })[] | undefined
	>();

	const getOwnedDomains = async () => {
		setOwnedDomains(undefined);
		if (!account) {
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		try {
			const owned = (await sdk.getDomainsByOwner(account, false)) as (Domain & {
				paymentTokenInfo: ConvertedTokenInfo;
			})[];
			// TODO: Optimize this
			const domainsPaymentTokenData = owned.map(async ({ id }) => {
				const paymentToken = await sdk.zauction.getPaymentTokenForDomain(id);
				const paymentTokenInfo: ConvertedTokenInfo =
					(await getPaymentTokenInfo(sdk, paymentToken)) || {};
				return { id, paymentTokenInfo };
			});
			const domainsPaymentTokenInfo = await Promise.all(
				domainsPaymentTokenData,
			);
			const transformedDomainData = owned.map((item) => ({
				...item,
				paymentTokenInfo:
					domainsPaymentTokenInfo?.find(({ id }) => id === item.id)
						?.paymentTokenInfo || ({} as ConvertedTokenInfo),
			}));
			if (isMounted.current) {
				setOwnedDomains(transformedDomainData);
				setIsLoading(false);
			}
		} catch (e) {
			if (isMounted.current) {
				console.error(e);
				setIsLoading(false);
			}
		}
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
