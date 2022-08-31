import { FutureButton, Image, StatsWidget } from 'components';
import { ConnectWalletButton } from 'containers';
import { truncateWalletAddress } from 'lib/utils';

import styles from './PoolDetails.module.scss';

type PoolDetailsProps = {
	apy?: number;
	buyLink?: string;
	className?: string;
	contractAddress: string;
	icon: string;
	isUserConnected: boolean;
	name: string;
	onStake: () => void;
	peopleStaked?: number;
	ticker: string;
	tokenName: string;
	totalRewards?: number;
	tokensLocked?: string;
	valueLocked?: string;
	tokenPurchaseUrl?: string;
};

const PoolDetails: React.FC<PoolDetailsProps> = ({
	apy,
	buyLink,
	className,
	contractAddress,
	icon,
	isUserConnected,
	name,
	onStake,
	peopleStaked,
	ticker,
	tokenName,
	totalRewards,
	tokensLocked,
	valueLocked,
	tokenPurchaseUrl,
}) => {
	return (
		<section className={className}>
			<div className={'flex-split flex-vertical-align'}>
				<div className={styles.Header}>
					<Image
						className="border-rounded"
						style={{ height: 80, width: 80 }}
						src={icon}
					/>{' '}
					<h1 className={'glow-text-white'}>{name}</h1>
				</div>
				{isUserConnected ? (
					<FutureButton glow onClick={onStake}>
						Stake
					</FutureButton>
				) : (
					<ConnectWalletButton>Connect Wallet To Stake</ConnectWalletButton>
				)}
			</div>
			{/* @todo switch to grid */}
			<ul className={styles.Stats}>
				<StatsWidget
					className="normalView"
					fieldName={'Token'}
					isLoading={tokenName === undefined || ticker === undefined}
					title={`${tokenName} (${ticker})`}
					subTitle={
						tokenPurchaseUrl && (
							<a href={tokenPurchaseUrl} target="_blank" rel="noreferrer">
								Buy {ticker}
							</a>
						)
					}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'APR'}
					isLoading={false}
					title={`${apy}%`}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'Total Rewards'}
					isLoading={false}
					title={'-'}
				/>
			</ul>
			<ul className={styles.Stats}>
				<StatsWidget
					className="normalView"
					fieldName={'People Staked'}
					isLoading={false}
					title={'-'}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'Total Value Locked'}
					isLoading={false}
					title={`${tokensLocked} ${ticker}`}
					subTitle={`$${valueLocked} USD`}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'Contract Address'}
					isLoading={contractAddress === undefined}
					title={contractAddress && truncateWalletAddress(contractAddress)}
					subTitle={
						<a
							href={'https://etherscan.io/address/' + contractAddress}
							target="_blank"
							rel="noreferrer"
						>
							View Contract
						</a>
					}
				/>
			</ul>
		</section>
	);
};

export default PoolDetails;
