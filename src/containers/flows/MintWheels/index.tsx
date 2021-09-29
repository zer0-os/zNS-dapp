import { useCallback, useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';

import { Overlay, Spinner } from 'components';

import MintWheels from './MintWheels';

import { Stage, DropData, TransactionData } from './types';
import {
	getDropData,
	getUserEligibility,
	getBalanceEth,
	getNumberPurchasedByUser,
} from './helpers';
import { useZnsContracts } from 'lib/contracts';
import { Web3Provider } from '@ethersproject/providers';
import { ethers } from 'ethers';
import { Maybe } from 'lib/types';
import useNotification from 'lib/hooks/useNotification';

import * as wheels from '../../../lib/wheelSale';

const MintWheelsFlowContainer = () => {
	// Web3 hooks
	const { account, library } = useWeb3React<Web3Provider>();
	const { addNotification } = useNotification();

	// Contracts
	const contracts = useZnsContracts();
	const saleContract = contracts?.wheelSale;

	// Wizard state
	const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);

	// Auction data
	const [dropStage, setDropStage] = useState<Stage | undefined>();
	const [wheelsTotal, setWheelsTotal] = useState<number | undefined>();
	const [wheelsMinted, setWheelsMinted] = useState<number | undefined>();
	const [maxPurchasesPerUser, setMaxPurchasesPerUser] = useState<
		number | undefined
	>();

	// User data
	const [isUserWhitelisted, setIsUserWhitelisted] = useState<
		boolean | undefined
	>();
	const [balanceEth, setBalanceEth] = useState<number | undefined>();
	const [numberPurchasedByUser, setNumberPurchasedByUser] = useState<
		number | undefined
	>();

	///////////////
	// Functions //
	///////////////

	const openWizard = () => {
		setIsWizardOpen(true);
	};

	const closeWizard = () => {
		setIsWizardOpen(false);
	};

	const transactionSuccessful = (numWheels: number) => {
		addNotification(
			`Successfully minted ${numWheels} Wheels. Open your Profile to view them`,
		);
	};

	// Submits transaction, feeds status updates
	// back through the callbacks provided by MintWheels
	const onSubmitTransaction = async (data: TransactionData) => {
		const { numWheels, statusCallback, errorCallback, finishedCallback } = data;

		if (!saleContract) {
			return;
		}

		let tx: Maybe<ethers.ContractTransaction>;

		statusCallback('Pending wallet approval');

		try {
			tx = await wheels.purchaseWheels(numWheels, saleContract);
		} catch (e) {
			console.error(e);
			errorCallback('Failed to submit transaction');
			return;
		}

		statusCallback('Waiting for transaction to be completed');
		await tx.wait();

		finishedCallback();
		transactionSuccessful(numWheels);
	};

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		let isMounted = true;
		const getData = async () => {
			if (!saleContract) {
				return;
			}

			// Get the data related to the drop
			getDropData(saleContract)
				.then((d) => {
					if (!isMounted) {
						return;
					}
					const primaryData = d as DropData;
					setDropStage(primaryData.dropStage);
					setWheelsTotal(primaryData.wheelsTotal);
					setWheelsMinted(primaryData.wheelsMinted);
					setMaxPurchasesPerUser(primaryData.maxPurchasesPerUser);
				})
				.catch((e) => {
					console.error(e);
				});

			// Get user data if wallet connected
			if (account && library) {
				getUserEligibility(account, saleContract).then((d) => {
					if (isMounted && d !== undefined) {
						setIsUserWhitelisted(d);
					}
				});
				getBalanceEth(library.getSigner()).then((d) => {
					if (isMounted && d !== undefined) {
						setBalanceEth(d);
					}
				});
				getNumberPurchasedByUser(account, saleContract).then((d) => {
					if (isMounted && d !== undefined) {
						setNumberPurchasedByUser(d);
					}
				});
			} else {
				setIsUserWhitelisted(undefined);
				setBalanceEth(undefined);
				setNumberPurchasedByUser(undefined);
			}
		};
		getData();
		return () => {
			isMounted = false;
		};
	}, [account, library, saleContract]);

	////////////
	// Render //
	////////////

	return (
		<>
			{isWizardOpen && (
				<Overlay open onClose={closeWizard}>
					<MintWheels
						balanceEth={balanceEth}
						dropStage={dropStage}
						isUserWhitelisted={isUserWhitelisted}
						maxPurchasesPerUser={maxPurchasesPerUser}
						numberPurchasedByUser={numberPurchasedByUser}
						onClose={closeWizard}
						onSubmitTransaction={onSubmitTransaction}
						userId={account as string | undefined}
						wheelsMinted={wheelsMinted}
						wheelsTotal={wheelsTotal}
					/>
				</Overlay>
			)}
			<div style={{ height: 124, position: 'relative', marginBottom: 16 }}>
				<button
					style={{
						position: 'absolute',
						width: '100%',
						height: 124,
						background: 'var(--background-blue-card-wilder)',
						color: 'white',
						borderRadius: 'var(--box-radius)',
						zIndex: 6,
					}}
					onClick={openWizard}
				>
					{dropStage === undefined && <Spinner style={{ margin: '0 auto' }} />}
					{dropStage !== undefined && (
						<>
							Wheels Drop -- {wheelsMinted}/{wheelsTotal} (this will be the real
							banner)
						</>
					)}
				</button>
			</div>
		</>
	);
};

export default MintWheelsFlowContainer;
