import RaffleRegistration from './RaffleRegistration';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { Maybe } from 'lib/types';

const RegistrationContainer = () => {
	const { account, active, library, chainId } = useWeb3React<Web3Provider>();

	const submit = async (
		statusCallback: (status: string) => void,
	): Promise<void> => {
		return new Promise(async (resolve, reject) => {
			if (chainId !== 1) {
				reject('Please connect to Ethereum Mainnet');
				return;
			}

			// Get user eth balance
			let ethBalance;
			try {
				ethBalance = await getEthBalance();
			} catch (e) {
				reject(e);
				return;
			}

			// Sign transaction
			statusCallback(
				'Please sign transaction in your wallet to be entered in the raffle...',
			);

			let signedMessage;
			try {
				signedMessage = await signMessage();
			} catch (e) {
				reject(e);
				return;
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
			throw new Error('Could not find web3 library');
		}
		const ethBalance = await library.getSigner().getBalance();
		const asString = ethers.utils.formatEther(ethBalance);
		return Number(asString);
	};

	const signMessage = async () => {
		if (!library) {
			throw new Error('Failed to find Web3 provider');
		}
		const signer = library.getSigner();
		let signedBid: Maybe<string>;
		try {
			signedBid = await signer?.signMessage('Wilder Cribs Raffle Registration');
		} catch {
			throw new Error('Failed to sign message');
		}
		return signedBid;
	};

	const submitEmail = (email: string): Promise<boolean> => {
		return new Promise((resolve) => {
			fetch('https://zns-mail-microservice.herokuapp.com/cribs', {
				method: 'POST',
				headers: {
					Accept: 'application/json',
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({ email: email }),
			})
				.then((r) => {
					resolve(r.ok);
					// setHasSubmitted(true);
				})
				.catch((e) => {
					resolve(false);
					console.error(e);
				});
		});
	};

	return (
		<RaffleRegistration
			isWalletConnected={active}
			onSubmit={submit}
			onSubmitEmail={submitEmail}
		/>
	);
};

export default RegistrationContainer;
