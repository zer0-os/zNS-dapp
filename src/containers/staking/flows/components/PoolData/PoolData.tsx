import { Artwork, StatsWidget } from 'components';

import styles from './PoolData.module.scss';

import classNames from 'classnames/bind';
import { ethers } from 'ethers';
import { displayEther, displayEtherToFiat, toFiat } from 'lib/currency';

const cx = classNames.bind(styles);

type PoolDataProps = {
	apy?: string;
	domain: string;
	id: string;
	image: string;
	isUserConnected?: boolean;
	name: string;
	poolUrl: string;
	pendingRewards?: ethers.BigNumber;
	wildToUsd?: number;
};

const PoolData = ({
	apy,
	domain,
	id,
	image,
	isUserConnected,
	name,
	poolUrl,
	pendingRewards,
	wildToUsd,
}: PoolDataProps) => (
	<>
		<div className="flex-split flex-vertical-align">
			<div>
				<Artwork
					disableAnimation
					name={name}
					image={image}
					disableInteraction
					id={id}
					style={{ maxWidth: 200 }}
				/>
			</div>
		</div>
		<ul className={cx(styles.Stats, 'flex-split')}>
			<StatsWidget
				className="previewView"
				fieldName={'APR'}
				isLoading={false}
				title={apy}
			/>
			<StatsWidget
				className="previewView"
				fieldName={'Your Pool Rewards Claimable'}
				isLoading={isUserConnected && pendingRewards === undefined}
				title={
					isUserConnected
						? pendingRewards && displayEther(pendingRewards) + ' WILD'
						: '-'
				}
				subTitle={
					isUserConnected &&
					pendingRewards !== undefined &&
					wildToUsd &&
					'$' + displayEtherToFiat(pendingRewards, wildToUsd)
				}
			/>
		</ul>
	</>
);

export default PoolData;
