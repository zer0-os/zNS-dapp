import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { StatsWidget } from 'components';
import useCurrency from 'lib/hooks/useCurrency';
// TODO: Generalize styles for both pages
import styles from '../../staking/Deposits/Deposits.module.scss';

export const Assets = () => {
	const { active, account } = useWeb3React<Web3Provider>();
	const { wildPriceUsd } = useCurrency();

	return (
		<>
			{!!account && (
				<ul className={styles.Stats}>
					<StatsWidget
						className="normalView"
						fieldName={'Wallet WILD Balance'}
						isLoading={false}
						title={'Title'}
						subTitle={'Subtitle'}
					/>
					<StatsWidget
						className="normalView"
						fieldName={'Value'}
						isLoading={false}
						title={'$1,234,567.89'}
						subTitle={'Subtitle'}
					/>
					<StatsWidget
						className="normalView"
						fieldName={'WILD Holders'}
						isLoading={false}
						title={'1,234'}
						subTitle={'Subtitle'}
					/>
				</ul>
			)}
			{/* <DepositTable /> */}
		</>
	);
};
