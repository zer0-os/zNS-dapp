import { useMemo } from 'react';
import { HistoryItem } from './History.types';
import { Groups } from './History.types';
import {
	LABELS,
	WEEK_IN_MILLISECONDS,
	MONTH_IN_MILLISECONDS,
} from './History.constants';
import styles from './History.module.scss';

type HistoryItemProps = {
	items: HistoryItem[];
};

const isToday = (date: Date) => date.getDay() === new Date().getDay();

const isLastWeek = (date: Date) =>
	!isToday(date) &&
	date.getTime() >= new Date().getTime() - WEEK_IN_MILLISECONDS; // 604,800,000 = 1 week in milis

const isLastMonth = (date: Date) =>
	!isLastWeek(date) &&
	date.getTime() >= new Date().getTime() - MONTH_IN_MILLISECONDS;

const getGroupFromDate = (date: Date) => {
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

const History = ({ items }: HistoryItemProps) => {
	const groups = useMemo(() => {
		const segments: any = {};
		items.forEach((item: HistoryItem) => {
			const group = getGroupFromDate(item.date);
			if (segments[group] === undefined) {
				segments[group] = [item];
			} else {
				segments[group].push(item);
			}
		});
		return segments;
	}, [items]);

	console.log(groups);

	return (
		<ul className={styles.Container}>
			{Object.keys(groups).map((group) => (
				<li className={styles.Group}>
					<h2>{LABELS[Number(group) as Groups]}</h2>
					<ul>
						{groups[Number(group)].map((item: HistoryItem) => (
							<li className={styles.Event}>
								<span>{item.event}</span>
								<span>
									{item.date.toLocaleDateString()}{' '}
									{item.date.toLocaleTimeString()}
								</span>
							</li>
						))}
					</ul>
				</li>
			))}
		</ul>
	);
};

export default History;
