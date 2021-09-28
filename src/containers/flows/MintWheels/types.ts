// Enums

export enum Stage {
	Upcoming,
	Whitelist,
	Public,
	Ended,
	Sold,
}

export enum Step {
	LoadingPrimary,
	Info,
	CheckingBalance,
	InsufficientFunds,
	SelectAmount,
	PendingWalletApproval,
}

// Types

export type PrimaryData = {
	dropStage: Stage;
	wheelsTotal: number;
	wheelsMinted: number;
};

export type WheelQuantity = {
	total: number;
	minted: number;
};

export type Drop = {
	wheelQuantity: WheelQuantity;
	dateWhitelist: number;
	datePublic: number;
};
