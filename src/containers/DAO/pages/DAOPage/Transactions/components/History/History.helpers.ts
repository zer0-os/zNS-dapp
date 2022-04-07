import {
	MONTH_IN_MILLISECONDS,
	WEEK_IN_MILLISECONDS,
} from './History.constants';
import { Groups } from './History.types';

const isToday = (date: Date) => date.getDay() === new Date().getDay();

const isLastWeek = (date: Date) =>
	!isToday(date) &&
	date.getTime() >= new Date().getTime() - WEEK_IN_MILLISECONDS; // 604,800,000 = 1 week in milis

const isLastMonth = (date: Date) =>
	!isLastWeek(date) &&
	date.getTime() >= new Date().getTime() - MONTH_IN_MILLISECONDS;

export const getGroupFromDate = (date: Date) => {
	if (isToday(date)) {
		return Groups.TODAY;
	}
	if (isLastWeek(date)) {
		return Groups.LAST_WEEK;
	}
	if (isLastMonth(date)) {
		return Groups.LAST_MONTH;
	}
	return Groups.EARLIER;
};
