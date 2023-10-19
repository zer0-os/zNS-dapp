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

const DAO: React.FC = () => {
	const { setNavbarTitle } = useNavbar();

	useDidMount(() => {
		document.title = import.meta.env.VITE_APP_TITLE + ' | DAOs';
		setNavbarTitle('DAOs');
	});

	const { provider, account, chainId } = useWeb3();

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
						connectWallet: () => {},
					}}
				/>
			</Switch>
		</div>
	);
};

export default DAO;
