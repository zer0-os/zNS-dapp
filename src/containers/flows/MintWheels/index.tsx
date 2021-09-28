import { useCallback, useEffect, useState } from 'react';

import { useWeb3React } from '@web3-react/core';

import { Overlay, Spinner } from 'components';

import MintWheels from './MintWheels';

import { Stage, Step, PrimaryData } from './types';
import { getPrimaryData, getUserEligibility, getBalanceEth } from './helpers';

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

	const onSubmitTransaction = useCallback((numWheels: number) => {
		console.log(numWheels);
	}, []);

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		let isMounted = true;
		const getData = async () => {
			// Get the data related to the drop
			getPrimaryData()
				.then((d) => {
					if (!isMounted) {
						return;
					}
					const primaryData = d as PrimaryData;
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
						userId={account as string | undefined}
						wheelsMinted={500}
						wheelsTotal={1000}
						onSubmitTransaction={onSubmitTransaction}
					/>
				</Overlay>
			)}
			<button onClick={openWizard}>
				{dropStage === undefined && <Spinner />}
				{dropStage !== undefined && (
					<>
						Auction stage {dropStage} -- {wheelsMinted}/{wheelsTotal} (this will
						be the real banner)
					</>
				)}
			</button>
		</>
	);
};

export default MintWheelsFlowContainer;
