import { BigNumber, providers } from 'ethers';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';
import { useEffect, useState } from 'react';

interface ZauctionApprovalProps {
	library: any;
	account: any;
	domainId: string;
	price?: BigNumber;
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

	useEffect(() => {
		const provider = library && new providers.Web3Provider(library.provider);
		const signer = provider && provider.getSigner(account!);
		setApprovalLoading(true);

		(async () => {
			await (
				await sdk.instance.getZAuctionInstanceForDomain(domainId)
			)
				.getZAuctionSpendAllowance(await signer?.getAddress()!)
				.then((data) => {
					setApprovalLoading(false);
					if (price) {
						setZAuctionApproved(data.gt(price));
					} else {
						setZAuctionApproved(data.gt(BigNumber.from(0.1)));
					}
				})
				.catch((error) => {
					setNetworkError(error);
				});
		})();
	}, []);

	return [isZAuctionApproved, isApprovalLoading];
};

export const useApproveZauction = ({
	library,
	account,
	domainId,
	price,
}: ZauctionApprovalProps) => {
	const sdk = useZnsSdk();

	const [isZAuctionApproved, setZAuctionApproved] = useState(false);
	const [isApprovalLoading, setApprovalLoading] = useState(false);
	const [networkError, setNetworkError] = useState('');

	useEffect(() => {
		const provider = library && new providers.Web3Provider(library.provider);
		const signer = provider && provider.getSigner(account!);
		setApprovalLoading(true);

		(async () => {
			await (
				await sdk.instance.getZAuctionInstanceForDomain(domainId)
			)
				.approveZAuctionSpendTradeTokens(await signer?.getAddress()!)
				.then((data) => {
					setApprovalLoading(false);
					setZAuctionApproved(true);
				})
				.catch((error) => {
					setNetworkError(error);
				});
		})();
	}, []);

	return [isZAuctionApproved, isApprovalLoading, networkError];
};
