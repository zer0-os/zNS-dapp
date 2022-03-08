import { ethers } from 'ethers';
import { BancorContractRegistry__factory, BancorNetwork__factory } from 'types';
import { RPC_URLS } from './connectors';
import { Maybe } from './types';

const tokenToUsdCache: { [token: string]: number | undefined } = {};

export const tokenToUsd = async (token: string): Promise<number> => {
	if (tokenToUsdCache[token]) {
		return tokenToUsdCache[token]!;
	}

	let priceInUsd: Maybe<number>;

	if (token === 'LOOT') {
		priceInUsd = await getLootPrice();
	} else {
		const res = await fetch(
			`https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`,
		);

		const data = await res.json();

		if (!data[token]) {
			throw Error(`Unable to fetch price for ${token}`);
		}

		priceInUsd = data[token].usd as number;
	}

	tokenToUsdCache[token] = priceInUsd;

	return priceInUsd;
};

const ethAddress = '0xEeeeeEeeeEeEeeEeEeEeeEEEeeeeEeeeeeeeEEeE';
const infinityTokenAddress = '0xf56efd691c64ef76d6a90d6b2852ce90fa8c2dcf';
const lootTokenAddress = '0x43b8219aC1883373C0428688eE1a76e19E6B6D9d';
const bancorContractRegistryAddress =
	'0x52Ae12ABe5D8BD778BD5397F99cA900624CfADD4';

const getLootPrice = async () => {
	// needs to be mainnet
	const provider = new ethers.providers.JsonRpcProvider(RPC_URLS[1]);
	const registry = BancorContractRegistry__factory.connect(
		bancorContractRegistryAddress,
		provider,
	);
	const networkAddress = await registry.addressOf(
		await registry.BANCOR_NETWORK(),
	);
	const bancorNetwork = BancorNetwork__factory.connect(
		networkAddress,
		provider,
	);

	const tokenPath = [
		ethAddress,
		infinityTokenAddress,
		infinityTokenAddress,
		lootTokenAddress,
		lootTokenAddress,
	];

	const ethToLoot = parseFloat(
		ethers.utils.formatEther(
			(
				await bancorNetwork.getReturnByPath(
					tokenPath,
					ethers.utils.parseEther('1.0'),
				)
			)[0],
		),
	);

	const ethToUsd = await tokenToUsd('ethereum');
	const usdToLoot = ethToUsd / ethToLoot;
	return usdToLoot;
};

// Token Price
export const wildTokenPrice = async () => {
	return await tokenToUsd('wilder-world');
};

export const lootTokenPrice = async () => {
	return await tokenToUsd('LOOT');
};

export const ethTokenPrice = async () => {
	return await tokenToUsd('ethereum');
};
