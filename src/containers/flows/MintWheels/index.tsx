import { useCallback, useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';

import { Overlay, Spinner } from 'components';

import MintWheels from './MintWheels';

import { Stage, DropData, TransactionData } from './types';
import { getDropData, getUserEligibility, getBalanceEth } from './helpers';

const MintWheelsFlowContainer = () => {
	// Web3 hooks
	const { account } = useWeb3React();

	// Wizard state
	const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);

	// Auction data
	const [dropStage, setDropStage] = useState<Stage | undefined>();
	const [wheelsTotal, setWheelsTotal] = useState<number | undefined>();
	const [wheelsMinted, setWheelsMinted] = useState<number | undefined>();

	// User data
	const [isUserWhitelisted, setIsUserWhitelisted] = useState<
		boolean | undefined
	>();
	const [balanceEth, setBalanceEth] = useState<number | undefined>();

	///////////////
	// Functions //
	///////////////

	const openWizard = () => {
		setIsWizardOpen(true);
	};

	const closeWizard = () => {
		setIsWizardOpen(false);
	};

	const transactionSuccessful = () => {
		console.log('yay');
	};

	// Submits transaction, feeds status updates
	// back through the callbacks provided by MintWheels
	const onSubmitTransaction = useCallback((data: TransactionData) => {
		const { numWheels, statusCallback, errorCallback, finishedCallback } = data;
		statusCallback('Pending wallet approval');
		setTimeout(() => {
			setTimeout(() => {
				statusCallback('Transaction pending');
				setTimeout(() => {
					if (Math.random() >= 0.5) {
						errorCallback('Simulated transaction fail');
					} else {
						finishedCallback();
						transactionSuccessful();
					}
				}, 2000);
			});
		}, 2000);
	}, []);

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		let isMounted = true;
		const getData = async () => {
			// Get the data related to the drop
			getDropData()
				.then((d) => {
					if (!isMounted) {
						return;
					}
					const primaryData = d as DropData;
					setDropStage(primaryData.dropStage);
					setWheelsTotal(primaryData.wheelsTotal);
					setWheelsMinted(primaryData.wheelsMinted);
				})
				.catch((e) => {
					console.error(e);
				});

			// Get user data if wallet connected
			if (account) {
				getUserEligibility(account).then((d) => {
					if (!isMounted || d !== undefined) {
						setIsUserWhitelisted(d);
					}
				});
				getBalanceEth().then((d) => {
					if (!isMounted || d !== undefined) {
						setBalanceEth(d);
					}
				});
			}
		};
		getData();
		return () => {
			isMounted = false;
		};
	}, []);

	// Handles changes to wallet
	// Checks user whitelist status against API - sets as state variable
	// Checks user Eth balance - sets as state variable
	//
	// note: could set this to only run when the modal opens by putting
	// isWizardOpen as a dependency
	useEffect(() => {
		let isMounted = true;
		if (account) {
			getUserEligibility(account).then((d) => {
				if (!isMounted || d !== undefined) {
					setIsUserWhitelisted(d);
				}
			});
			getBalanceEth().then((d) => {
				if (!isMounted || d !== undefined) {
					setBalanceEth(d);
				}
			});
		} else {
			setIsUserWhitelisted(undefined);
			setBalanceEth(undefined);
		}
		return () => {
			isMounted = false;
		};
	}, [account]);

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
