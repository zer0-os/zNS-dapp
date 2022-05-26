// Validation
export const isValidTokenId = (text: string) =>
	// replace with tokenID validation
	/^0x[a-fA-F0-9]{66}$/.test(String(text).toLowerCase());

export const isValid = (tokenID: string) => isValidTokenId(tokenID);
