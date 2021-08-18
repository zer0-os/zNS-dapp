import { ethers } from "ethers";
import addresses from "./addresses";
import { RPC_URLS } from "./connectors";
import { NETWORK_TYPES } from "./network";

const tokenToUsdCache: { [token: string]: number | undefined } = {};

export const tokenToUsd = async (token: string): Promise<number> => {
	if (tokenToUsdCache[token]) {
		return tokenToUsdCache[token]!;
	}

	if (token === 'LOOT') {
		return 0.1;
	}

	const res = await fetch(
		`https://api.coingecko.com/api/v3/simple/price?ids=${token}&vs_currencies=usd`,
	);

	const data = await res.json();
	if (!data) {
		throw Error(`Unable to fetch price for ${token}`);
	}

	const priceInUsd = data[token].usd as number;

	tokenToUsdCache[token] = priceInUsd;

	return priceInUsd;
};

const wEthTokenAddress = '0xC02aaA39b223FE8D0A0e5C4F27eAD9083C756Cc2';
const infinityTokenAddress = '0xf56efd691c64ef76d6a90d6b2852ce90fa8c2dcf';
const lootTokenAddress = addresses[NETWORK_TYPES.MAINNET].lootToken;

const contractRegistryAbi = [
	"function addressOf(bytes32 _contractName) public view returns (address);"
]
const bancorContractRegistryAddress = "0x52Ae12ABe5D8BD778BD5397F99cA900624CfADD4";

const getLootPrice = async () => {
	const mainnetProvider = new ethers.providers.JsonRpcProvider(RPC_URLS[1]);
	const registry = new ethers.Contract(bancorContractRegistryAddress, [], mainnetProvider);

	const tokenPath = [wEthTokenAddress, infinityTokenAddress, infinityTokenAddress, lootTokenAddress];


}

export const wildToUsd = async (amount: number) => {
	const price = await tokenToUsd('wilder-world');

	return amount * price;
};
