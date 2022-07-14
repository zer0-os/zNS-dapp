import { ConvertedTokenInfo } from '@zero-tech/zns-sdk';
import * as ZNS from '@zero-tech/zns-sdk';

interface PaymentTokenCache {
	[index: string]: ConvertedTokenInfo;
}

var paymentTokenCache: PaymentTokenCache = {};

const getPaymentTokenInfo = async (
	sdk: ZNS.Instance,
	tokenId: string,
): Promise<ConvertedTokenInfo> => {
	if (paymentTokenCache[tokenId]) {
		return paymentTokenCache[tokenId];
	} else {
		if (
			tokenId.toLowerCase() ===
			'0x3Ae5d499cfb8FB645708CC6DA599C90e64b33A79'.toLowerCase()
		) {
			paymentTokenCache[tokenId] = {
				id: tokenId,
				name: 'Wilder',
				symbol: 'WILD',
				priceInUsd: '0.185',
				decimals: '18',
			};
		} else if (
			tokenId.toLowerCase() ===
			'0x5bAbCA2Af93A9887C86161083b8A90160DA068f2'.toLowerCase()
		) {
			paymentTokenCache[tokenId] = {
				id: tokenId,
				name: 'Zer0',
				symbol: 'ZERO',
				priceInUsd: '0.032',
				decimals: '18',
			};
		} else {
			const data = await sdk.zauction.getPaymentTokenInfo(tokenId);
			paymentTokenCache[tokenId] = data;
		}
		return paymentTokenCache[tokenId];
	}
};

export default getPaymentTokenInfo;
