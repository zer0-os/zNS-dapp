//- React Imports
import { memo, useState } from 'react';

//- Components Imports
import { Artwork, OptionDropdown, Overlay } from 'components';
import { Option } from 'components/Dropdowns/OptionDropdown/OptionDropdown';

//- Library Imports
import { ethers } from 'ethers';
import { useWeb3React } from '@web3-react/core';

//- Constants Imports
import { AltText, Labels, Modal, TestId } from '../BidTable.constants';

//- Container Imports
import { CancelBid, MakeABid } from 'containers';

//- Types Imports
import { ActionKeys, BidTableData } from '../BidTable.types';

//- Library Imports
import usePageWidth from 'lib/hooks/usePageWidth';

//- Utils Imports
import { handleDomainNameWidth, getTableActions } from '../BidTable.utils';

//- Styles Imports
import styles from './BidTableCard.module.scss';
import moreIcon from 'assets/more-vertical.svg';

const BidTableCard = (props: any) => {
	const dimensions = usePageWidth();
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
			<div className={styles.CardContainer} data-testid={TestId.CARD_CONTAINER}>
				<div className={styles.Content}>
					<div className={styles.DomainInfoContainer}>
						<Artwork
							subtext={'0://' + bid.domainName}
							disableInteraction
							metadataUrl={bid.domainMetadataUrl}
							id={bid.domainId}
							style={{ maxWidth: handleDomainNameWidth(dimensions.pageWidth) }}
						/>

						<div className={styles.BidContainer}>
							<div className={styles.TextContainer}>
								<div className={styles.Title}>{Labels.YOUR_BID}</div>
								<div className={styles.Bid} data-testid={TestId.YOUR_BID}>
									{ethers.utils.formatEther(bid.yourBid.toString())}{' '}
									{bid.paymentTokenInfo.symbol}
								</div>
							</div>

							<div className={styles.TextContainer}>
								<div className={styles.Title}>{Labels.TOP_BID}</div>
								<div className={styles.Bid} data-testid={TestId.HIGHEST_BID}>
									{ethers.utils.formatEther(bid.highestBid)}{' '}
									{bid.paymentTokenInfo.symbol}
								</div>
							</div>
						</div>
					</div>
					<div className={styles.OptionsContainer}>
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
					</div>
				</div>
			</div>
		</>
	);
};

export default memo(BidTableCard);
