export const Messages = {
	LOADING: 'Loading Your Bids',
	EMPTY: 'You have not placed any bids.',
};

export const AltText = {
	MORE_OPTIONS: 'more actions',
};

export const TestId = {
	ROW_CONTAINER: 'bid-table-row-container',
	CARD_CONTAINER: 'bid-table-card-container',
	ARTWORK: 'bid-table-artwork',
	HIGHEST_BID: 'bid-table-highest-bid',
	YOUR_BID: 'bid-table-your-bid',
	OPTIONS: 'bid-table-options',
};

export const Labels = {
	YOUR_BID: 'Your Bid',
	TOP_BID: 'Top Bid',
};

export const Errors = {
	FAILED_TO_RETRIEVE_BIDS: 'Failed to retrieve bids for account.',
	FAILED_TO_PARSE_BID_DATA: 'Failed to parse bid data.',
};

export const OptionTitle = {
	REBID: 'Rebid',
	CANCEL_BID: 'Cancel Bid',
};

export enum Modal {
	Bid,
	Cancel,
}

export const Headers = [
	{
		label: 'Domain',
		accessor: '',
		className: 'domain',
	},
	{
		label: 'Your Bid',
		accessor: '',
		className: '',
	},
	{
		label: 'Top Bid',
		accessor: '',
		className: '',
	},
	{
		label: '',
		accessor: '',
		className: '',
	},
];
