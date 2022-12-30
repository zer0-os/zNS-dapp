import { ethers } from 'ethers';

export const TABLE_HEADERS = [
	{
		label: '',
		accessor: '',
		className: '',
	},
	{
		label: 'Pool',
		accessor: '',
		className: '',
	},
	{
		label: 'Date Claimed',
		accessor: '',
		className: '',
	},
	{
		label: 'Amount',
		accessor: '',
		className: '',
	},
	{
		label: 'Unlock Date',
		accessor: '',
		className: '',
	},
];

export const getTimestampLabel = (timestamp: ethers.BigNumber) => {
	if (timestamp.gt(0)) {
		return getDateFromTimestamp(timestamp).toLocaleString().split(',')[0];
	}
	// Only have flexible locking for now
	return 'No Lock (Flexible)';
};

export const getDateFromTimestamp = (timestamp: ethers.BigNumber) => {
	return new Date(timestamp.toNumber() * 1000);
};

export const compareTimestamp = (timestamp: ethers.BigNumber, date: Date) => {
	return getDateFromTimestamp(timestamp) < date;
};
