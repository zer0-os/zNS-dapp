import { Web3Provider } from '@ethersproject/providers';
import { Registrar__factory } from '../types/factories/Registrar__factory';
import { useWeb3 } from 'lib/web3-connection/useWeb3';
import { useMemo } from 'react';
import addresses from './addresses';
import { chainIdToNetworkType, defaultNetworkId } from './network';
import { Registrar } from '../types/Registrar';
import {
	BasicController,
	BasicController__factory,
	ERC20,
	ERC20__factory,
	StakingController,
	StakingController__factory,
	WhitelistSimpleSale,
	WhitelistSimpleSale__factory,
	ZauctionSupportingZNS,
	ZauctionSupportingZNS__factory,
} from 'types';
import * as ethers from 'ethers';
import { RPC_URLS } from './connectors';

export interface ContractAddresses {
	basic: string;
	registrar: string;
	staking: string;
	wildToken: string;
	lootToken: string;
	zAuction: string;
	wheelSale: string;
	stakeFactory: string;
	lpToken: string;
	wildStakingPool: string;
	lpStakingPool: string;
	zDao: string;
}

export interface Contracts {
	registry: Registrar;
	basicController: BasicController;
	stakingController: StakingController;
	wildToken: ERC20;
	lootToken: ERC20;
	zAuction: ZauctionSupportingZNS;
	wheelSale: WhitelistSimpleSale;
}

function useZnsContracts(): Contracts | null {
	const context = useWeb3();
	const { provider, isActive, chainId } = context;

	const contract = useMemo((): Contracts | null => {
		let contracts;
		let signer: ethers.Signer | ethers.providers.Provider =
			new ethers.VoidSigner(ethers.constants.AddressZero);
		if (!provider) {
			if (RPC_URLS[defaultNetworkId]) {
				signer = new ethers.providers.JsonRpcProvider(
					RPC_URLS[defaultNetworkId],
				);
			}

			contracts = addresses[chainIdToNetworkType(defaultNetworkId)];
		} else {
			if (!chainId) {
				console.error(`No chainid detected;`);
				return null;
			}

			contracts = addresses[chainIdToNetworkType(chainId)];
			signer = provider.getSigner();
		}

		if (!contracts) {
			console.error(`chain not supported`);
			return null;
		}

		return {
			registry: Registrar__factory.connect(contracts.registrar, signer),
			basicController: BasicController__factory.connect(
				contracts.basic,
				signer,
			),
			stakingController: StakingController__factory.connect(
				contracts.staking,
				signer,
			),
			wildToken: ERC20__factory.connect(contracts.wildToken, signer),
			lootToken: ERC20__factory.connect(contracts.lootToken, signer),
			zAuction: ZauctionSupportingZNS__factory.connect(
				contracts.zAuction,
				signer,
			),
			wheelSale: WhitelistSimpleSale__factory.connect(
				contracts.wheelSale,
				signer,
			),
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isActive, provider, chainId]);
	return contract;
}

function useContractAddresses(): ContractAddresses | undefined {
	const context = useWeb3();
	const { provider, isActive, chainId } = context;
	const networkAddresses = useMemo((): ContractAddresses | undefined => {
		if (!provider) {
			return addresses[chainIdToNetworkType(defaultNetworkId)];
		}

		return addresses[chainIdToNetworkType(chainId)];
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [isActive, provider, chainId]);
	return networkAddresses;
}

export { useZnsContracts, useContractAddresses };
