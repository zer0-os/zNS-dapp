//- React Imports
import { useState } from 'react';

//- Component Imports
import { MintDropNFTBanner, Overlay, ConnectToWallet } from 'components';

//- Types Imports
import { ClaimData } from './ClaimNFT.types';

//- Style Imports
import styles from './ClaimNFTContainer.module.scss';
import ClaimNFT from '../ClaimNFT/ClaimNFT';

export type ClaimNFTContainerProps = {
	requireBanner?: boolean;
};

const ClaimNFTContainer = ({ requireBanner }: ClaimNFTContainerProps) => {
	//////////////////
	// State & Data //
	//////////////////
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

	const onSubmit = async (data: ClaimData) => {
		// ADD CLAIM DOMAINS
		// const { quantity, statusCallback, finishedCallback, errorCallback } = data;
		// claimNFT(quantity, statusCallback, combinedFinishedCallback, errorCallback);
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
					<ClaimNFT
						openConnect={openConnect}
						onClose={closeWizard}
						onSubmit={onSubmit}
					/>
				</Overlay>
			)}
			{requireBanner ? (
				<div className={styles.BannerContainer}>
					<MintDropNFTBanner
						title={'Placeholder'}
						label={'Placeholder'}
						buttonText={'Placeholder'}
						onClick={openWizard}
					/>
				</div>
			) : (
				<ClaimNFT
					openConnect={openConnect}
					onClose={closeWizard}
					onSubmit={onSubmit}
				/>
			)}
		</>
	);
};

export default ClaimNFTContainer;
