//- Styles Imports
import styles from './BidTable.module.scss';

//- Components Imports
import { Artwork } from 'components';

//- Library Imports
import { ethers } from 'ethers';
import { ZAuctionVersionType } from 'lib/zAuction';

//- Containers Imports
import { CancelBidButton } from 'containers';

//- Constants Imports
import { TOKEN, STATUS } from './BidTableRow.constants';

export type BidTableRowData = {
	domainName: string;
	bidNonce: string;
	domainId: string;
	domainMetadataUrl: string;
	date: Date;
	yourBid: ethers.BigNumber;
	highestBid: ethers.BigNumber;
	version: ZAuctionVersionType;
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

	const isDisabled = bid.version === ZAuctionVersionType.V1;

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
					bidNonce={bid.bidNonce}
					isDisabled={isDisabled}
				/>
			</td>
		</tr>
	);
};

export default BidTableRow;
