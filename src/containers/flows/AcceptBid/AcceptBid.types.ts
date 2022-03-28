export enum ZAuctionVersionType {
	V1 = '1.0',
	V2 = '2.0',
}

export enum StepContent {
	FailedToCheckZAuction,
	CheckingZAuctionApproval,
	ApproveZAuction,
	WaitingForWallet,
	ApprovingZAuction,
	Details,
	Accepting,
	Success,
}

export enum Step {
	zAuction,
	ConfirmDetails,
	AcceptBid,
}
