//the hook that returns the useZauctionAPI with the api endpoint that match with the selected chain
// Infact it is not HOOK! Just Utility!

export const ZAUCTION_BASE_URL: { [key: number]: string } = {
	1: 'https://mainnet.zauction.api.zero.tech/api',
	4: 'https://zauction-api-rinkeby.herokuapp.com/api',
	42: 'https://zauction-kovan-api.herokuapp.com/api',
};

export const useZAuctionBaseApiUri = (chain: number): string | undefined => {
	return ZAUCTION_BASE_URL[chain];
};
