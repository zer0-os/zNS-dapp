/*
 * This component represents the "Set buy now price" step
 * of the Set Buy Now flow.
 */

// Component Imports
import { Detail, FutureButton, Wizard } from 'components';

// Constants Imports
import { ROOT_DOMAIN } from 'constants/domains';

// Library Imports
import { ethers } from 'ethers';
import { getNetworkZNA } from 'lib/utils';
import { Data } from '../BuyNow';

// Style Imports
import styles from './Details.module.scss';

type DetailsProps = {
	data: Data;
	error?: string;
	onCancel: () => void;
	onNext: () => void;
	wildPriceUsd: number;
	isWaitingForWalletConfirmation?: boolean;
	didSucceed?: boolean;
};

const Details = ({
	data,
	error,
	onCancel,
	onNext,
	wildPriceUsd,
	isWaitingForWalletConfirmation,
	didSucceed,
}: DetailsProps) => {
	const Actions = () => {
		if (isWaitingForWalletConfirmation) {
			return (
				<Wizard.Loading message="Waiting for approval from your wallet..." />
			);
		} else if (didSucceed) {
			return (
				<FutureButton glow onClick={onCancel}>
					Finish
				</FutureButton>
			);
		} else if (data.balanceWild.gte(data.buyNowPrice)) {
			return (
				<FutureButton glow onClick={onNext}>
					Confirm
				</FutureButton>
			);
		} else {
			return (
				<p className="error-text text-center">
					You have insufficient WILD to make this purchase
				</p>
			);
		}
	};

	const networkDomainName = getNetworkZNA(ROOT_DOMAIN, data.domain);

	return (
		<div className={styles.Container}>
			<Wizard.NFTDetails
				assetUrl={data.assetUrl}
				creator={data.creator}
				domain={networkDomainName}
				title={data.title}
				otherDetails={
					!didSucceed
						? [
								{
									name: 'Buy Now Price',
									value:
										Number(
											ethers.utils.formatEther(data.buyNowPrice),
										).toLocaleString() + ' WILD',
								},
						  ]
						: undefined
				}
			/>
			{!didSucceed && (
				<Detail
					className={styles.Balance}
					text={
						Number(
							ethers.utils.formatEther(data.balanceWild),
						).toLocaleString() + ' WILD'
					}
					subtext="Your Balance"
					mainClassName={styles.Value}
				/>
			)}
			{error && <p className="text-center error-text">{error}</p>}
			<div className={styles.Actions}>{Actions()}</div>
		</div>
	);
};

export default Details;
