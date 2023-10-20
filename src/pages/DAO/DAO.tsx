import { useNavbar } from '../../lib/hooks/useNavbar';
import { useDidMount } from '../../lib/hooks/useDidMount';
import { useWeb3 } from '../../lib/web3-connection/useWeb3';
import { ethers } from 'ethers';
import { RPC_URLS } from '../../lib/connectors';
import { defaultNetworkId } from '../../lib/network';
import React from 'react';
// @ts-ignore
import { DaosApp } from '@zero-tech/zapp-daos';
import { Switch } from 'react-router-dom';
import { useWeb3Modal } from '@web3modal/wagmi/react';

const DAO: React.FC = () => {
	const { setNavbarTitle } = useNavbar();

	useDidMount(() => {
		document.title = import.meta.env.VITE_TITLE + ' | DAOs';
		setNavbarTitle('DAOs');
	});

	const { provider, account, chainId } = useWeb3();
	const { open } = useWeb3Modal();

	return (
		<div className={'zapp-reset'}>
			<Switch>
				<DaosApp
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
			</Switch>
		</div>
	);
};

export default DAO;
