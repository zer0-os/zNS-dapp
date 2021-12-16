import { Artwork, StatsWidget } from 'components';

import styles from './PoolData.module.scss';

import classNames from 'classnames/bind';
import { ethers } from 'ethers';
import { displayEther, toFiat } from 'lib/currency';

const cx = classNames.bind(styles);

type PoolDataProps = {
	apy?: number;
	domain: string;
	id: string;
	image: string;
	name: string;
	poolUrl: string;
	pendingRewards?: ethers.BigNumber;
};

const PoolData = ({
	apy,
	domain,
	id,
	image,
	name,
	poolUrl,
	pendingRewards,
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
			<a target="_blank" rel="noreferrer" href={poolUrl}>
				See Pool Page
			</a>
		</div>
		<ul className={cx(styles.Stats, 'flex-split')}>
			<StatsWidget
				className="previewView"
				fieldName={'APY'}
				isLoading={false}
				title="-"
			/>
			<StatsWidget
				className="previewView"
				fieldName={'Your Rewards Claimable'}
				isLoading={pendingRewards === undefined}
				title={pendingRewards && displayEther(pendingRewards) + ' WILD'}
			/>
		</ul>
	</>
);

export default PoolData;
