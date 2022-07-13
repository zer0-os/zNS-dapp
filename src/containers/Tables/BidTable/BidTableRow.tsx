//- Styles Imports
import styles from './BidTable.module.scss';
import moreIcon from 'assets/more-horizontal.svg';
import { DollarSign, X } from 'react-feather';

//- Components Imports
import { Artwork, FutureButton, OptionDropdown, Tooltip } from 'components';
import { Option } from 'components/Dropdowns/OptionDropdown/OptionDropdown';

//- Library Imports
import { ethers } from 'ethers';
import { Domain } from 'lib/types';

//- Constants Imports
import { getNetworkZNA } from 'lib/utils';
import { useHistory } from 'react-router-dom';
import { ROUTES } from 'constants/routes';

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

	const { push: goTo } = useHistory();

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

	// Navigates to domain
	const onRowClick = () => {
		goTo(ROUTES.MARKET + '/' + getNetworkZNA(bid.domainName));
	};

	const getHighestBidSubtext = (): JSX.Element => {
		if (bid.yourBid < bid.highestBid) {
			return <p className={styles.Outbid}>Outbid</p>;
		} else {
			return <p className={styles.Leading}>Leading</p>;
		}
	};

	return (
		<tr className={styles.Container} data-testid={TEST_ID.CONTAINER}>
			<td onClick={onRowClick}>
				<Artwork
					data-testid={TEST_ID.ARTWORK}
					name={bid.domainName}
					domain={bid.domainName}
					metadataUrl={bid.domainMetadataUrl}
					id={bid.domainId}
					style={{ maxWidth: 200 }}
				/>
			</td>
			<td data-testid={TEST_ID.YOUR_BID} onClick={onRowClick}>
				<span>{ethers.utils.formatEther(bid.yourBid.toString())}</span>
			</td>
			<td
				data-testid={TEST_ID.HIGHEST_BID}
				onClick={onRowClick}
				className={styles.HighestBid}
			>
				<p>{ethers.utils.formatEther(bid.highestBid)}</p>
				{getHighestBidSubtext()}
			</td>

			<td>
				{bid.highestBid > bid.yourBid && (
					<FutureButton
						className={styles.RebidButton}
						glow
						onClick={() => props.openMakeBid?.(bid)}
					>
						{'Rebid'}
					</FutureButton>
				)}
			</td>

			<td>
				<OptionDropdown
					className={styles.MoreDropdown}
					onSelect={onSelectOption}
					options={ACTIONS}
					data-testid="bid-table-options"
				>
					<Tooltip placement="bottom-center" text="More options">
						<button className={styles.Button}>
							<img alt="more actions" src={moreIcon} />
						</button>
					</Tooltip>
				</OptionDropdown>
			</td>
		</tr>
	);
};

export default BidTableRow;
