export type TokenInformationType = {
	previewImage: string;
	mediaType: string;
	image: Buffer;
	name: string;
	domain: string;
	locked: boolean;
	story: string;
};

export type TokenDynamicType = {
	dynamic: boolean;
	ticker: string;
};

export type TokenStakeType = {
	amount: number;
	currency: string;
};

export type TokenType = {
	image: Buffer;
	name: string;
	domain: string;
	locked: boolean;
	story: string;
	dynamic: boolean;
	ticker: string;
	stake: number;
	currency: string;
};
