import { ethers } from 'ethers';
import { ERC20 } from 'types';
import { PoolInstance } from './temp-sdk/types';

export const getBalance = async (contract: ERC20, account: string) => {
	const balance = await contract.balanceOf(account);
	return balance;
};

export const getApproval = async (
	contract: ERC20,
	address: string,
	account: string,
	amount: number,
) => {
	const allowance: ethers.BigNumber = await contract.allowance(
		account,
		address,
	);
	if (allowance) {
		return allowance?.gt(ethers.utils.parseEther(amount.toString()));
	} else {
		return false;
	}
};

export const getTotalUserValue = async (
	pools: PoolInstance[],
	account: string,
) => {
	// Create promise array
	const promises: any[] = [];
	pools.forEach((pool: PoolInstance) =>
		promises.push(pool.calculateUserValueLocked(account)),
	);

	// Execute promise array
	const d = await Promise.all(promises);

	// Sum all pool values
	var totalLocked = ethers.BigNumber.from(0);
	var totalUnlocked = ethers.BigNumber.from(0);
	d.forEach((r: any) => {
		totalLocked = totalLocked.add(r.userValueLocked);
		totalUnlocked = totalUnlocked.add(r.userValueUnlocked);
	});

	return {
		locked: totalLocked,
		unlocked: totalUnlocked,
	};
};
