export const RPC_URLS: { [chainId: number]: string } = {
	1: process.env.REACT_APP_RPC_URL_1 as string,
	4: process.env.REACT_APP_RPC_URL_4 as string,
	42: process.env.REACT_APP_RPC_URL_42 as string,
	5: process.env.REACT_APP_RPC_URL_5 as string,
};
