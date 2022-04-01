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
	Finished,
	Approval,
}

// Types

export type DropData = {
	dropStage: Stage;
	wheelsTotal: number;
	wheelsMinted: number;
	maxPurchasesPerUser: number;
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

export type TransactionData = {
	numWheels: number;
	statusCallback: (status: string) => void;
	errorCallback: (error: string) => void;
	finishedCallback: () => void;
};
