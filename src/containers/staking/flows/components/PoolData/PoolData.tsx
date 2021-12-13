import { Artwork, StatsWidget } from 'components';

import styles from './PoolData.module.scss';

import classNames from 'classnames/bind';

const cx = classNames.bind(styles);

type PoolDataProps = {
	apy?: number;
	domain: string;
	id: string;
	image: string;
	name: string;
	poolUrl: string;
	totalValueLocked?: number;
};

const PoolData = ({
	apy,
	domain,
	id,
	image,
	name,
	poolUrl,
	totalValueLocked,
}: PoolDataProps) => (
	<>
		<div className="flex-split flex-vertical-align">
			<div>
				<Artwork
					domain={domain}
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
				isLoading={apy === undefined}
				title={Number(apy?.toFixed(2)).toLocaleString() + '%'}
			/>
			<StatsWidget
				className="previewView"
				fieldName={'Total Value Locked'}
				isLoading={totalValueLocked === undefined}
				title={totalValueLocked?.toLocaleString() + ' WILD'}
				subTitle={`$${(1234.0).toLocaleString()}`}
				accentText={`+123%`}
			/>
		</ul>
	</>
);

export default PoolData;
