// React
import { useMemo } from 'react';

// Lib
import { HistoryItem } from './History.types';
import { Groups } from './History.types';
import { LABELS } from './History.constants';
import { getGroupFromDate } from './History.helpers';

// Styles
import styles from './History.module.scss';

type HistoryItemProps = {
	items: HistoryItem[];
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
