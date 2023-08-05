import { useDidMount } from 'lib/hooks/useDidMount';
import { ethers } from 'ethers';
import { RPC_URLS } from '../../lib/connectors';
import { defaultNetworkId } from '../../lib/network';
import React from 'react';
import { useWeb3React } from '@web3-react/core';
import { StakingZApp } from '@zero-tech/zapp-staking';
import { useNavbar } from '../../lib/hooks/useNavbar';

const Staking: React.FC = () => {
	const { setNavbarTitle } = useNavbar();

	useDidMount(() => {
		document.title = process.env.REACT_APP_TITLE + ' | Staking';
		setNavbarTitle('Staking');
	});

	const { provider, account, chainId } = useWeb3React();

	return (
		<div className={'zapp-reset'}>
			<StakingZApp
				provider={
					provider ??
					new ethers.providers.JsonRpcProvider(RPC_URLS[defaultNetworkId])
				}
				route={'wilder'}
				web3={{
					chainId: (chainId as any) ?? 1,
					address: account as string | undefined,
					connectWallet: () => {},
				}}
			/>
		</div>
	);
};

export default Staking;
