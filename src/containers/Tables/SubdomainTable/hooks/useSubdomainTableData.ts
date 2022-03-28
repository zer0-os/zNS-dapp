import { DomainMetricsCollection } from '@zero-tech/zns-sdk';
import { useDidMount } from 'lib/hooks/useDidMount';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';
import { DisplayDomain } from 'lib/types';
import { useState } from 'react';

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
			try {
				const rawData = (await Promise.all(
					promises,
				)) as DomainMetricsCollection[];
				for (var m = 0; m < rawData.length; m++) {
					tradeData = { ...tradeData, ...rawData[m] };
				}
			} catch (e) {
				throw e;
			}
			const subDomainsData = subdomains.map((item) => ({
				...item,
				metrics: tradeData[item.id],
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

	useDidMount(getData);
	useUpdateEffect(getData, [sdk, subdomains, parentDomainId]);

	return {
		isLoading,
		data,
	};
};

export default useSubdomainTableData;
