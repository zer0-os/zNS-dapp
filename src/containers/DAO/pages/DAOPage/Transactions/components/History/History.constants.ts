import { Groups } from './History.types';

export const DAY_IN_MILLISECONDS = 1000 * 60 * 60 * 24;
export const WEEK_IN_MILLISECONDS = DAY_IN_MILLISECONDS * 7;
export const MONTH_IN_MILLISECONDS = DAY_IN_MILLISECONDS * 30;

export const LABELS = {
	[Groups.TODAY]: 'Today',
	[Groups.LAST_WEEK]: 'Last Week',
	[Groups.LAST_MONTH]: 'Last Month',
	[Groups.EARLIER]: 'Earlier',
};
