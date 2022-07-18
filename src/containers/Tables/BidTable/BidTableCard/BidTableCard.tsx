//- Components Imports
import { Artwork, OptionDropdown } from 'components';
import { Option } from 'components/Dropdowns/OptionDropdown/OptionDropdown';

//- Library Imports
import { ethers } from 'ethers';

//- Constants Imports
import { AltText, Labels, TestId } from '../BidTable.constants';

//- Types Imports
import { Actions, ActionKeys, BidTableData } from '../BidTable.types';

//- Library Imports
import usePageWidth from 'lib/hooks/usePageWidth';

//- Utils Imports
import { handleDomainNameWidth } from '../BidTable.utils';

//- Styles Imports
import styles from './BidTableCard.module.scss';
import moreIcon from 'assets/more-vertical.svg';

const BidTableCard = (props: any) => {
	const dimensions = usePageWidth();
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
						options={Actions}
						data-testid={TestId.OPTIONS}
					>
						<button className={styles.Button}>
							<img alt={AltText.MORE_OPTIONS} src={moreIcon} />
						</button>
					</OptionDropdown>
				</div>
			</div>
		</div>
	);
};

export default BidTableCard;
