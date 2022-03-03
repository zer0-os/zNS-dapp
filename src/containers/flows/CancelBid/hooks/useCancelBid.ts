import { useWeb3React } from '@web3-react/core';
import { Bid } from '@zero-tech/zauction-sdk';
import { useZnsSdk } from 'lib/providers/ZnsSdkProvider';

const useCancelBid = () => {
	const { library } = useWeb3React();
	const { instance: sdk } = useZnsSdk();

	const cancel = async (bid: Bid) => {
		if (!library) {
			return;
		}

		try {
			await sdk.zauction.cancelBid(
				bid.auctionId,
				bid.signedMessage,
				bid.tokenId,
				false,
				library.getSigner(),
			);
		} catch (e) {
			console.error(e);
			throw e;
		}
	};

	return {
		cancel,
	};
};

export default useCancelBid;
