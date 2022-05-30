import { Domain } from '@zero-tech/zns-sdk';
import { useDidMount } from 'lib/hooks/useDidMount';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useZnsSdk } from 'lib/hooks/sdk';
import { useRef, useState } from 'react';
import { PaymentTokenInfo } from 'lib/types';

type UseOwnedDomainsReturn = {
	isLoading: boolean;
	ownedDomains?: Domain[];
	refetch: () => void;
	domainsPaymentTokenInfo?: any[];
};

const useOwnedDomains = (
	account: string | undefined | null,
): UseOwnedDomainsReturn => {
	const isMounted = useRef<boolean>();
	const { instance: sdk } = useZnsSdk();

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [ownedDomains, setOwnedDomains] = useState<Domain[] | undefined>();
	const [domainsPaymentTokenInfo, setDomainsPaymentTokenInfo] = useState<
		any[] | undefined
	>();

	const getOwnedDomains = async () => {
		setOwnedDomains(undefined);
		if (!account) {
			setIsLoading(false);
			return;
		}
		setIsLoading(true);
		try {
			const owned = await sdk.getDomainsByOwner(account);
			// TODO: Optimize this
			const domainsPaymentTokenData = owned.map(async ({ id }) => {
				const paymentToken = await sdk.zauction.getPaymentTokenForDomain(id);
				const paymentTokenInfo: PaymentTokenInfo = {
					...(await sdk.zauction.getPaymentTokenInfo(paymentToken)),
					...{ id: paymentToken },
				};
				return { id, paymentTokenInfo };
			});
			setDomainsPaymentTokenInfo(await Promise.all(domainsPaymentTokenData));
			if (isMounted.current) {
				setOwnedDomains(owned);
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
		domainsPaymentTokenInfo,
	};
};

export default useOwnedDomains;
