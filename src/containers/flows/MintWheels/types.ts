export enum Stage {
	Upcoming,
	Whitelist,
	Public,
	Ended,
	Sold,
}

export type WheelQuantity = {
	total: number;
	minted: number;
};

export type Drop = {
	wheelQuantity: WheelQuantity;
	dateWhitelist: number;
	datePublic: number;
};
