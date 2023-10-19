export const RPC_URLS: { [chainId: number]: string } = {
	1: import.meta.env.VITE_RPC_URL_1 as string,
	4: import.meta.env.VITE_RPC_URL_4 as string,
	42: import.meta.env.VITE_RPC_URL_42 as string,
	5: import.meta.env.VITE_RPC_URL_5 as string,
};
