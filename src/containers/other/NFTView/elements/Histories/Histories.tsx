//- React Imports
import React from 'react';

//- Component Imports
import { HistoryItem } from './elements';

//- Type Imports
import { DomainEvents } from '../../NFTView.types';

//- Style Imports
import styles from '../../NFTView.module.scss';

//- Componennt level type definitions
type HistoriesProps = {
	isLoading: boolean;
	histories: DomainEvents[];
};

export const Histories: React.FC<HistoriesProps> = ({
	isLoading,
	histories,
}) => {
	return (
		<section
			className={`${styles.History} ${styles.Box} blur border-primary border-rounded`}
		>
			<h4>History</h4>

			{isLoading && (
				<div className={styles.Loading}>
					<span>Loading domain history</span>
				</div>
			)}

			{!isLoading && histories.length > 0 && (
				<ul>
					{histories.map((item: DomainEvents, i: number) => (
						<div key={i}>
							<HistoryItem item={item} />
						</div>
					))}
				</ul>
			)}
		</section>
	);
};

export default Histories;
