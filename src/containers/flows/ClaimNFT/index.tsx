// React Imports
import { useState } from 'react';

// Web3 Imports
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';

// Component Imports
import { MintDropNFTBanner, Overlay, ConnectToWallet } from 'components';

//- Style Imports
import styles from './ClaimNFTContainer.module.scss';
import ClaimNFT from '../ClaimNFT/ClaimNFT';

export type ClaimNFTContainerProps = {};

const ClaimNFTContainer = ({}: ClaimNFTContainerProps) => {
	//////////////////
	// State & Data //
	//////////////////

	const { active } = useWeb3React<Web3Provider>();
	const [isWizardOpen, setIsWizardOpen] = useState<boolean>(false);
	const [isConnectPromptOpen, setIsConnectPromptOpen] =
		useState<boolean>(false);

	///////////////
	// Functions //
	///////////////

	const openWizard = (event: any) => {
		setIsWizardOpen(true);
	};

	const closeWizard = () => {
		setIsWizardOpen(false);
	};

	const openConnect = () => {
		setIsConnectPromptOpen(true);
	};

	const closeConnect = () => {
		setIsConnectPromptOpen(false);
	};

	////////////
	// Render //
	////////////

	return (
		<>
			{isConnectPromptOpen && (
				<Overlay open onClose={closeConnect}>
					<ConnectToWallet onConnect={closeConnect} />
				</Overlay>
			)}
			{isWizardOpen && (
				<Overlay open onClose={closeWizard}>
					<ClaimNFT openConnect={openConnect} isWalletConnected={active} />
				</Overlay>
			)}
			<div className={styles.BannerContainer}>
				<MintDropNFTBanner
					title={''}
					label={''}
					buttonText={''}
					onClick={openWizard}
				/>
			</div>
		</>
	);
};

export default ClaimNFTContainer;
