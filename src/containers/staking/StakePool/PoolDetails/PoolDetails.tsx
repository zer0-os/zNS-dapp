import { FutureButton, Image, StatsWidget } from 'components';
import { ConnectWalletButton } from 'containers';

import { Stat } from '../StakePool.helpers';

import styles from './PoolDetails.module.scss';

type PoolDetailsProps = {
	apy?: number;
	buyLink?: string;
	className?: string;
	contractAddress: string;
	icon: string;
	isUserConnected: boolean;
	name: string;
	peopleStaked?: number;
	ticker: string;
	tokenName: string;
	totalRewards?: number;
	totalValueLocked?: number;
};

const PoolDetails: React.FC<PoolDetailsProps> = ({
	apy,
	buyLink,
	className,
	contractAddress,
	icon,
	isUserConnected,
	name,
	peopleStaked,
	ticker,
	tokenName,
	totalRewards,
	totalValueLocked,
}) => {
	return (
		<section className={className}>
			<div className={'flex-split flex-vertical-align'}>
				<div className={styles.Header}>
					<Image style={{ height: 80, width: 80 }} src={icon} />{' '}
					<h1 className={'glow-text-white'}>{name}</h1>
				</div>
				{isUserConnected ? (
					<FutureButton glow onClick={() => {}}>
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
					isLoading={false}
					title={`${tokenName} (${ticker})`}
					subTitle={
						<a
							href="https://app.uniswap.org/#/swap"
							target="_blank"
							rel="noreferrer"
						>
							Buy {ticker}
						</a>
					}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'APY'}
					isLoading={apy === undefined}
					title={Number(apy?.toFixed(2)).toLocaleString() + '%'}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'Total Rewards'}
					isLoading={totalRewards === undefined}
					title={Number(totalRewards?.toFixed(2)).toLocaleString() + ' WILD'}
				/>
			</ul>
			<ul className={styles.Stats}>
				<StatsWidget
					className="normalView"
					fieldName={'People Staked'}
					isLoading={peopleStaked === undefined}
					title={Math.abs(peopleStaked || 0).toLocaleString()}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'Total Value Locked'}
					isLoading={totalValueLocked === undefined}
					title={
						Number(totalValueLocked?.toFixed(2)).toLocaleString() + ' ' + ticker
					}
				/>
				<StatsWidget
					className="normalView"
					fieldName={'Contract Address'}
					isLoading={contractAddress === undefined}
					title={contractAddress}
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
