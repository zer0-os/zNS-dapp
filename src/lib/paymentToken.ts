import { ConvertedTokenInfo } from '@zero-tech/zns-sdk';
import * as ZNS from '@zero-tech/zns-sdk';
import * as ZContracts from '@zero-tech/zero-contracts';

interface PaymentTokenCache {
	[index: string]: ConvertedTokenInfo;
}

var paymentTokenCache: PaymentTokenCache = {};

const getPaymentTokenInfo = async (
	sdk: ZNS.Instance,
	tokenId: string,
): Promise<ConvertedTokenInfo> => {
	const { rinkeby, goerli } = ZContracts.zer0ProtocolAddresses;
	if (paymentTokenCache[tokenId]) {
		return paymentTokenCache[tokenId];
	} else {
		if (
			tokenId.toLowerCase() === rinkeby?.tokens?.wildToken?.toLowerCase() ||
			tokenId.toLowerCase() === goerli?.tokens?.wildToken?.toLowerCase()
		) {
			paymentTokenCache[tokenId] = {
				id: tokenId,
				name: 'Wilder',
				symbol: 'WILD',
				priceInUsd: '0.185',
				decimals: '18',
			};
		} else if (
			tokenId.toLowerCase() === rinkeby?.tokens?.lootToken?.toLowerCase() ||
			tokenId.toLowerCase() === goerli?.tokens?.lootToken?.toLowerCase() ||
			tokenId.toLowerCase() === goerli?.tokens?.zeroToken?.toLowerCase()
		) {
			paymentTokenCache[tokenId] = {
				id: tokenId,
				name: 'Zer0',
				symbol: 'ZERO',
				priceInUsd: '0.032',
				decimals: '18',
			};
		} else {
			try {
				const data = await sdk.zauction.getPaymentTokenInfo(tokenId);
				if (data) {
					paymentTokenCache[tokenId] = data;
				}
			} catch (e) {
				console.error('Unable to get payment token info', tokenId, e);
			}
		}
		return paymentTokenCache[tokenId];
	}
};

export default getPaymentTokenInfo;
