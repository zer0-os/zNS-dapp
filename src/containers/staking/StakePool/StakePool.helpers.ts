export enum HistoryItem {
	Mint,
	Stake,
	Claim,
}

export const HISTORY_ITEMS = [
	{
		address: '0x0DDdA1dd73C063Af0A8D4Df0CDd2a6818685f9CE',
		type: HistoryItem.Mint,
		date: new Date(),
		amount: 0,
	},
	{
		address: '0x0DDdA1dd73C063Af0A8D4Df0CDd2a6818685f9CE',
		type: HistoryItem.Stake,
		date: new Date(),
		amount: 1285,
	},
	{
		address: '0x0DDdA1dd73C063Af0A8D4Df0CDd2a6818685f9CE',
		type: HistoryItem.Claim,
		date: new Date(),
		amount: 5382,
	},
];

export type Stat = {
	fieldName: string;
	isLoading: boolean;
	title: string;
	subTitle: string;
};
