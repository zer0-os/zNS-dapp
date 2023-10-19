import { useDidMount } from 'lib/hooks/useDidMount';
import { ethers } from 'ethers';
import { RPC_URLS } from '../../lib/connectors';
import { defaultNetworkId } from '../../lib/network';
import React from 'react';
import { useWeb3 } from 'lib/web3-connection/useWeb3';
import { StakingZApp } from '@zero-tech/zapp-staking';
import { useNavbar } from '../../lib/hooks/useNavbar';
import { useWeb3Modal } from '@web3modal/wagmi/react';

const Staking: React.FC = () => {
	const { setNavbarTitle } = useNavbar();

	useDidMount(() => {
		document.title = import.meta.env.VITE_APP_TITLE + ' | Staking';
		setNavbarTitle('Staking');
	});

	const { provider, account, chainId } = useWeb3();
	const { open } = useWeb3Modal();

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
					connectWallet: open,
				}}
			/>
		</div>
	);
};

export default Staking;
