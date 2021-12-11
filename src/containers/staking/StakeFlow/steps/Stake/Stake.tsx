import { StakeModule } from 'containers/staking';

import { StatsWidget, Artwork } from 'components';

import classNames from 'classnames/bind';

import styles from './Stake.module.scss';

import backIcon from './assets/back.svg';
import successIcon from './assets/success.svg';
import errorIcon from './assets/error.svg';

const cx = classNames.bind(styles);

const Stake = () => {
	const apy = 553215.5382915;
	const totalValueLocked = 53253.5389215321;
	const message = {
		error: true,
		content: <span>Failed to submit transaction</span>,
	};

	const onBack = () => {
		// @todo wire up back button
		console.log('back');
	};

	const onStake = (amount: number) => {
		// @todo wire up stake flow
		console.log('staking', amount);
	};

	return (
		<div className={styles.Container}>
			<button
				className={cx(styles.Back, 'flex-vertical-align')}
				onClick={onBack}
			>
				<img src={backIcon} alt="back" /> All Pools
			</button>
			{message && (
				<div
					className={cx(
						message.error && styles.Error,
						styles.Message,
						'border-rounded',
					)}
				>
					<img src={message.error ? errorIcon : successIcon} />
					<div className={styles.Content}>{message.content}</div>
				</div>
			)}
			<div className="flex-split flex-vertical-align">
				<div>
					<Artwork
						circleIcon
						domain={'hello'}
						name={'Stake WILD'}
						image={'https://picsum.photos/200/200'}
						disableInteraction
						id={'123'}
						style={{ maxWidth: 200 }}
					/>
				</div>
				<a href="https://youtube.com/">See Pool Page</a>
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
			<StakeModule
				className="border-rounded"
				balance={10000}
				onStake={onStake}
				tokenName={'WILD'}
			/>
		</div>
	);
};

export default Stake;
