//- Styles Imports
import styles from './BidTable.module.scss';
import moreIcon from 'assets/more-vertical.svg';
import { DollarSign, X } from 'react-feather';

//- Components Imports
import { Artwork, OptionDropdown } from 'components';

//- Library Imports
import { ethers } from 'ethers';

//- Constants Imports
import { TOKEN } from './BidTableRow.constants';
import { Option } from 'components/Dropdowns/OptionDropdown/OptionDropdown';
import { Domain } from 'lib/types';
import { TokenPriceInfo } from '@zero-tech/zns-sdk';

export const ACTION_KEYS = {
	REBID: 'Rebid',
	CANCEL_BID: 'Cancel Bid',
};

export const ACTIONS = [
	{
		icon: <DollarSign />,
		title: ACTION_KEYS.REBID,
	},
	{
		icon: <X />,
		title: ACTION_KEYS.CANCEL_BID,
	},
];

export type BidTableRowData = {
	domainName: string;
	bidNonce: string;
	domainId: string;
	domainMetadataUrl: string;
	date: Date;
	yourBid: ethers.BigNumber;
	highestBid: ethers.BigNumber;
	domain: Domain;
	paymentTokenInfo: TokenPriceInfo;
};

export const TEST_ID = {
	CONTAINER: 'bid-table-row-container',
	ARTWORK: 'bid-table-row-artwork',
	HIGHEST_BID: 'bid-table-row-highest-bid',
	YOUR_BID: 'bid-table-row-your-bid',
	OPTIONS: 'bid-table-options',
};

const BidTableRow = (props: any) => {
	const bid: BidTableRowData = props.data;

	const onSelectOption = (option: Option) => {
		switch (option.title) {
			case ACTION_KEYS.REBID:
				props.openMakeBid?.(bid);
				return;
			case ACTION_KEYS.CANCEL_BID:
				props.openCancelBid?.(bid);
				return;
		}
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
			<td data-testid={TEST_ID.YOUR_BID}>
				{ethers.utils.formatEther(bid.yourBid.toString())}{' '}
				{bid.paymentTokenInfo.name}
			</td>
			<td data-testid={TEST_ID.HIGHEST_BID}>
				{ethers.utils.formatEther(bid.highestBid)} {bid.paymentTokenInfo.name}
			</td>
			<td>
				<OptionDropdown
					className={styles.MoreDropdown}
					onSelect={onSelectOption}
					options={ACTIONS}
					data-testid="bid-table-options"
				>
					<button className={styles.Button}>
						<img alt="more actions" src={moreIcon} />
					</button>
				</OptionDropdown>
			</td>
		</tr>
	);
};

export default BidTableRow;
