//- Types Imports
import { Actions, ActionKeys, BidTableData } from '../BidTable.types';

//- Components Imports
import { Artwork, OptionDropdown } from 'components';
import { Option } from 'components/Dropdowns/OptionDropdown/OptionDropdown';

//- Library Imports
import { ethers } from 'ethers';

//- Constants Imports
import { AltText, TestId } from '../BidTable.constants';

//- Styles Imports
import styles from '../BidTable.module.scss';
import moreIcon from 'assets/more-vertical.svg';

const BidTableRow = (props: any) => {
	const bid: BidTableData = props.data;

	const onSelectOption = (option: Option) => {
		switch (option.title) {
			case ActionKeys.REBID:
				props.openMakeBid?.(bid);
				return;
			case ActionKeys.CANCEL_BID:
				props.openCancelBid?.(bid);
				return;
		}
	};

	return (
		<tr className={styles.Container} data-testid={TestId.ROW_CONTAINER}>
			<td>
				<Artwork
					data-testid={TestId.ARTWORK}
					domain={bid.domainName}
					disableInteraction
					metadataUrl={bid.domainMetadataUrl}
					id={bid.domainId}
					style={{ maxWidth: 200 }}
				/>
			</td>
			<td data-testid={TestId.YOUR_BID}>
				{ethers.utils.formatEther(bid.yourBid.toString())}{' '}
				{bid.paymentTokenInfo.name}
			</td>
			<td data-testid={TestId.HIGHEST_BID}>
				{ethers.utils.formatEther(bid.highestBid)} {bid.paymentTokenInfo.name}
			</td>
			<td>
				<OptionDropdown
					className={styles.MoreDropdown}
					onSelect={onSelectOption}
					options={Actions}
					data-testid={TestId.OPTIONS}
				>
					<button className={styles.Button}>
						<img alt={AltText.MORE_OPTIONS} src={moreIcon} />
					</button>
				</OptionDropdown>
			</td>
		</tr>
	);
};

export default BidTableRow;
