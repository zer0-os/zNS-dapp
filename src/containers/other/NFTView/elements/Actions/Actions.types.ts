export enum ACTION_TYPES {
	BuyNow,
	SetBuyNow,
	Bid,
	YourBid,
}

export type ActionBlock = {
	amount: number | string | undefined;
	label: string;
	amountUsd: string;
	buttonComponent: (isTextButton?: boolean) => JSX.Element;
	isVisible: boolean;
	shouldShowBorder?: boolean;
	testId: string;
};
