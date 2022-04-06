export type HistoryItem = {
	event: string | React.ReactNode;
	date: Date;
};

export enum Groups {
	TODAY,
	LAST_WEEK,
	LAST_MONTH,
	EARLIER,
}
