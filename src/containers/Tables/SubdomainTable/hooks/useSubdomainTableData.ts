import {
	DomainMetricsCollection,
	ConvertedTokenInfo,
} from '@zero-tech/zns-sdk';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useZnsSdk } from 'lib/hooks/sdk';
import { DisplayDomain } from 'lib/types';
import { useState } from 'react';
import useAsyncEffect from 'use-async-effect';
import { isRootDomain } from 'lib/utils';
import getPaymentTokenInfo from 'lib/paymentToken';

export type UseSubdomainTableDataReturn = {
	isLoading: boolean;
	data: any[]; // change this
};

const useSubdomainTableData = (
	parentDomainId: string | undefined,
	subdomains: DisplayDomain[] | undefined,
): UseSubdomainTableDataReturn => {
	const { instance: sdk } = useZnsSdk();

	const [isLoading, setIsLoading] = useState<boolean>(true);
	const [data, setData] = useState<any>();
	const isRoot = isRootDomain(parentDomainId);

	const getData = async () => {
		setData(undefined);
		setIsLoading(true);

		if (!parentDomainId || !subdomains) {
			return;
		}

		const subdomainIds = subdomains.map((item) => item.id);

		/*
		 * There's a cap on the number of IDs you can get domain metrics for
		 * in one call, so we have to batch the calls.
		 */
		var temporary: string[] = [];
		const chunk = 900;
		const promises = [];

		for (var i = 0, j = subdomainIds.length; i < j; i += chunk) {
			temporary = subdomainIds.slice(i, i + chunk);
			promises.push(
				// eslint-disable-next-line no-loop-func
				new Promise((resolve, reject) => {
					try {
						sdk.getDomainMetrics(temporary).then((d) => {
							resolve(d);
						});
					} catch {
						reject();
					}
				}),
			);
		}

		try {
			var tradeData: DomainMetricsCollection = {};
			let paymentTokenData:
				| ConvertedTokenInfo
				| { id: string; paymentTokenInfo: ConvertedTokenInfo }[];
			try {
				const rawData = (await Promise.all(
					promises,
				)) as DomainMetricsCollection[];
				for (var m = 0; m < rawData.length; m++) {
					tradeData = { ...tradeData, ...rawData[m] };
				}

				// If we're on the root domain, we need to get the payment token info for all the subdomains
				paymentTokenData = isRoot
					? await Promise.all(
							subdomainIds.map(async (id) => {
								const paymentToken =
									await sdk.zauction.getPaymentTokenForDomain(id);
								const paymentTokenInfo: ConvertedTokenInfo =
									await getPaymentTokenInfo(sdk, paymentToken);
								return { id, paymentTokenInfo };
							}),
					  )
					: await getPaymentTokenInfo(
							sdk,
							await sdk.zauction.getPaymentTokenForDomain(parentDomainId),
					  );
			} catch (e) {
				throw e;
			}
			const subDomainsData = subdomains.map((item) => ({
				...item,
				metrics: tradeData[item.id],
				paymentTokenInfo: isRoot
					? (
							paymentTokenData as {
								id: string;
								paymentTokenInfo: ConvertedTokenInfo;
							}[]
					  ).find((i) => i.id === item.id)?.paymentTokenInfo
					: paymentTokenData,
			}));
			setData(subDomainsData);
			setIsLoading(false);
		} catch (err) {
			console.error(
				`Failed to load subdomain data for parent ${parentDomainId}, found error:`,
				(err as Error).message,
			);
			setIsLoading(false);
			setData(undefined);
		}
	};

	useAsyncEffect(getData, []);
	useUpdateEffect(getData, [sdk, subdomains, parentDomainId]);

	return {
		isLoading,
		data,
	};
};

export default useSubdomainTableData;
