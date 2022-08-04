//- React Imports
import React from 'react';

//- Component Imports
import { HistoryItem } from './elements';

//- Type Imports
import { DomainEvents } from '../../NFTView.types';

//- Style Imports
import styles from '../../NFTView.module.scss';
import { ConvertedTokenInfo } from '@zero-tech/zns-sdk';

//- Component level type definitions
type HistoryProps = {
	isLoading: boolean;
	history: DomainEvents[];
	paymentTokenInfo?: ConvertedTokenInfo;
};

export const History: React.FC<HistoryProps> = ({
	isLoading,
	history,
	paymentTokenInfo,
}) => {
	return (
		<section className={styles.History}>
			<h4>History</h4>

			{isLoading && (
				<div className={styles.Loading}>
					<span>Loading domain history</span>
				</div>
			)}

			{!isLoading && History.length > 0 && (
				<ul>
					{history.map((item: DomainEvents, i: number) => (
						<div key={i}>
							<HistoryItem item={item} paymentTokenInfo={paymentTokenInfo} />
						</div>
					))}
				</ul>
			)}
		</section>
	);
};

export default History;
