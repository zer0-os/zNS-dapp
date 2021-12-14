import { GenericTable } from 'components';
import DepositTableRow from './DepositTableRow';

import { useStaking } from 'lib/providers/staking/StakingProvider';

import styles from './DepositTable.module.scss';

import { TABLE_HEADERS } from './DepositTable.helpers';
import { useWeb3React } from '@web3-react/core';
import { ConnectWalletButton } from 'containers';
import { Link } from 'react-router-dom';

const DepositTable = () => {
	const { deposits } = useStaking();
	const { active } = useWeb3React();

	if (!active) {
		return (
			<div className={styles.Container}>
				<p>Connect a Web3 wallet to see your Staking data</p>
				<ConnectWalletButton>Connect Wallet</ConnectWalletButton>
			</div>
		);
	} else if (!deposits || (deposits && deposits.length)) {
		return (
			<GenericTable
				alignments={[0, 0, 1, 1, 1, 1, 1]}
				data={deposits}
				isLoading={deposits === undefined}
				loadingText={'Loading Deposits'}
				itemKey={'id'}
				headers={TABLE_HEADERS}
				empty={deposits?.length === 0}
				rowComponent={DepositTableRow}
			/>
		);
	}

	return (
		<div className={styles.Container}>
			<p>
				You have not staked in any pools. Get started on the{' '}
				<Link to={'/pools'}>Pools Page</Link>
			</p>
		</div>
	);
};

export default DepositTable;
