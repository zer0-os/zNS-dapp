// Form validation
export const isEthAddress = (text: string) =>
	/^0x[a-fA-F0-9]{40}$/.test(String(text).toLowerCase());

export const isValid = (walletAddress: string) => isEthAddress(walletAddress);
