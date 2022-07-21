//- React Imports
import { memo, useState } from 'react';

//- Types Imports
import { ActionKeys, BidTableData, getTableActions } from '../BidTable.types';

//- Components Imports
import { Artwork, OptionDropdown, Overlay } from 'components';
import { Option } from 'components/Dropdowns/OptionDropdown/OptionDropdown';

//- Container Imports
import { CancelBid, MakeABid } from 'containers';

//- Library Imports
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';

//- Constants Imports
import { AltText, Modal, TestId } from '../BidTable.constants';

//- Styles Imports
import styles from '../BidTable.module.scss';
import moreIcon from 'assets/more-vertical.svg';

const BidTableRow = (props: any) => {
	const [modal, setModal] = useState<Modal | undefined>();
	const [selectedBid, setSelectedBid] = useState<BidTableData>();
	const { account } = useWeb3React();

	const bid: BidTableData = props.data;

	const options = getTableActions(account?.toLowerCase(), bid.domain.owner);

	const openMakeBid = (bid: BidTableData) => {
		setSelectedBid(bid);
		setModal(Modal.MAKE_A_BID);
	};

	const openCancelBid = (bid: BidTableData) => {
		setSelectedBid(bid);
		setModal(Modal.CANCEL);
	};

	const closeModal = () => {
		setModal(undefined);
		setSelectedBid(undefined);
	};

	const onSelectOption = (option: Option) => {
		switch (option.title) {
			case ActionKeys.REBID:
				openMakeBid?.(bid);
				return;
			case ActionKeys.CANCEL_BID:
				openCancelBid?.(bid);
				return;
		}
	};

	return (
		<>
			{modal === Modal.MAKE_A_BID && selectedBid && (
				<MakeABid
					domain={selectedBid.domain}
					onBid={props.refetch}
					onClose={() => setModal(undefined)}
					paymentTokenInfo={selectedBid.paymentTokenInfo}
				/>
			)}
			{modal === Modal.CANCEL && selectedBid && (
				<Overlay onClose={() => setModal(undefined)} open>
					<CancelBid
						bidNonce={selectedBid.bidNonce}
						domainId={selectedBid.domainId}
						onSuccess={props.refetch}
						onClose={closeModal}
						paymentTokenInfo={selectedBid.paymentTokenInfo}
					/>
				</Overlay>
			)}
			<tr className={styles.Container} data-testid={TestId.ROW_CONTAINER}>
				<td>
					<Artwork
						data-testid={TestId.ARTWORK}
						domain={'0://' + bid.domainName}
						disableInteraction
						metadataUrl={bid.domainMetadataUrl}
						id={bid.domainId}
						style={{ maxWidth: 200 }}
					/>
				</td>
				<td data-testid={TestId.YOUR_BID}>
					{ethers.utils.formatEther(bid.yourBid.toString())}{' '}
					{bid.paymentTokenInfo.symbol}
				</td>
				<td data-testid={TestId.HIGHEST_BID}>
					{ethers.utils.formatEther(bid.highestBid)}{' '}
					{bid.paymentTokenInfo.symbol}
				</td>
				<td>
					<OptionDropdown
						className={styles.MoreDropdown}
						onSelect={onSelectOption}
						options={options}
						data-testid={TestId.OPTIONS}
					>
						<button className={styles.Button}>
							<img alt={AltText.MORE_OPTIONS} src={moreIcon} />
						</button>
					</OptionDropdown>
				</td>
			</tr>
		</>
	);
};

export default memo(BidTableRow);
