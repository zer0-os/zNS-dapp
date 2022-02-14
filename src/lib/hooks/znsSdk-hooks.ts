import { BigNumber, providers } from 'ethers';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';
import { useEffect, useState } from 'react';

interface ZauctionApprovalProps {
	library: any;
	account: any;
	domainId: string;
	price?: string;
}

export const useZauctionApproval = ({
	library,
	account,
	domainId,
	price,
}: ZauctionApprovalProps) => {
	const sdk = useZnsSdk();

	const [isZAuctionApproved, setZAuctionApproved] = useState(false);
	const [isApprovalLoading, setApprovalLoading] = useState(false);
	const [networkError, setNetworkError] = useState('');

	const provider = library && new providers.Web3Provider(library.provider);
	const signer = provider && provider.getSigner(account!);

	const leastPrice = BigNumber.from(price ? price : '100');

	useEffect(() => {
		setApprovalLoading(true);

		(async () => {
			await (
				await sdk.instance.getZAuctionInstanceForDomain(domainId)
			)
				.getZAuctionSpendAllowance(await signer?.getAddress()!)
				.then((data) => {
					setApprovalLoading(false);
					setZAuctionApproved(data.gt(leastPrice));
				})
				.catch((error) => {
					setNetworkError(error);
				});
		})();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [domainId]);

	return [isZAuctionApproved, isApprovalLoading, networkError];
};

export const useBuyNowPrice = ({
	library,
	account,
	domainId,
}: ZauctionApprovalProps) => {
	const sdk = useZnsSdk();

	const [buyPrice, setBuyPrice] = useState<string | undefined>();
	const [isFetching, setFetching] = useState(false);
	const [networkError, setNetworkError] = useState('');

	const provider = library && new providers.Web3Provider(library.provider);
	const signer = provider && provider.getSigner(account!);

	useEffect(() => {
		setFetching(true);

		(async () => {
			await (
				await sdk.instance.getZAuctionInstanceForDomain(domainId)
			)
				.getBuyNowPrice(domainId, signer!)
				.then((price: BigNumber) => {
					setBuyPrice(price.toString());
					setFetching(false);
				})
				.catch((error: any) => {
					setNetworkError(error);
				});
		})();

		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [domainId]);

	return [buyPrice, isFetching, networkError];
};
