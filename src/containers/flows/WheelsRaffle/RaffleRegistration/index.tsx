import RaffleRegistration from './RaffleRegistration';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { Maybe } from 'lib/types';

const RegistrationContainer = () => {
	const { account, active, library } = useWeb3React<Web3Provider>();

	const submit = async (
		statusCallback: (status: string) => void,
	): Promise<void> => {
		return new Promise(async (resolve, reject) => {
			// Get user eth balance
			let ethBalance;
			try {
				ethBalance = await getEthBalance();
			} catch (e) {
				reject(e);
			}

			// Sign transaction
			statusCallback('Verifying wallet - please approve signature request');

			let signedMessage;
			try {
				signedMessage = await signMessage();
			} catch (e) {
				reject(e);
			}

			// Check we have all the data
			if (!account || ethBalance === undefined || !signedMessage) {
				reject('Something went wrong');
			}
			fetch('https://raffle-entry-microservice.herokuapp.com/', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					address: account,
					ethBalance,
					signedMessage,
				}),
			})
				.then(async (r) => {
					if (r.ok) {
						resolve();
					} else {
						const message = (await r.json()).message;
						reject(message);
					}
				})
				.catch(() => {
					reject('Failed to connect to Raffle API');
				});
		});
	};

	const getEthBalance = async () => {
		if (!library) {
			throw 'Could not find web3 library';
		}
		const ethBalance = await library.getSigner().getBalance();
		const asString = ethers.utils.formatEther(ethBalance);
		return Number(asString);
	};

	const signMessage = async () => {
		if (!library) {
			throw 'Failed to find Web3 provider';
		}
		const signer = library.getSigner();
		let signedBid: Maybe<string>;
		try {
			signedBid = await signer?.signMessage(
				'Wilder Wheels Raffle Registration',
			);
		} catch {
			throw 'Failed to sign message';
		}
		return signedBid;
	};

	return <RaffleRegistration isWalletConnected={active} onSubmit={submit} />;
};

export default RegistrationContainer;