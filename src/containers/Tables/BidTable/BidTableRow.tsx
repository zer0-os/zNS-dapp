import styles from './BidTable.module.scss';

import { Artwork } from 'components';
import { ethers } from 'ethers';
import { CancelBidButton } from 'containers';
import { TOKEN, STATUS } from './BidTableRow.constants';

export type BidTableRowData = {
	domainName: string;
	auctionId: string;
	domainId: string;
	domainMetadataUrl: string;
	date: Date;
	yourBid: ethers.BigNumber;
	highestBid: ethers.BigNumber;
};

export const TEST_ID = {
	CONTAINER: 'bid-table-row-container',
	ARTWORK: 'bid-table-row-artwork',
	HIGHEST_BID: 'bid-table-row-highest-bid',
	YOUR_BID: 'bid-table-row-your-bid',
	DATE: 'bid-table-row-date',
	STATUS: 'bid-table-row-status',
};

const BidTableRow = (props: any) => {
	const bid: BidTableRowData = props.data;
	const isHighestBid = bid.yourBid.gte(bid.highestBid);

	const onSuccess = () => {
		props.onRefetch();
	};

	return (
		<tr className={styles.Container} data-testid={TEST_ID.CONTAINER}>
			<td>
				<Artwork
					data-testid={TEST_ID.ARTWORK}
					domain={
						bid.domainName.startsWith('wilder.')
							? bid.domainName.split('wilder.')[1]
							: bid.domainName
					}
					disableInteraction
					metadataUrl={bid.domainMetadataUrl}
					id={bid.domainId}
					style={{ maxWidth: 200 }}
				/>
			</td>
			<td data-testid={TEST_ID.DATE}>{bid.date.toLocaleDateString()}</td>
			<td data-testid={TEST_ID.YOUR_BID}>
				{ethers.utils.formatEther(bid.yourBid.toString())} {TOKEN}
			</td>
			<td data-testid={TEST_ID.HIGHEST_BID}>
				{ethers.utils.formatEther(bid.highestBid)} {TOKEN}
			</td>
			<td
				data-testid={TEST_ID.STATUS}
				className={isHighestBid ? styles.Lead : styles.Outbid}
			>
				{isHighestBid ? STATUS.LEAD : STATUS.OUTBID}
			</td>
			<td>
				<CancelBidButton
					onSuccess={onSuccess}
					domainId={bid.domainId}
					auctionId={bid.auctionId}
				/>
			</td>
		</tr>
	);
};

export default BidTableRow;
