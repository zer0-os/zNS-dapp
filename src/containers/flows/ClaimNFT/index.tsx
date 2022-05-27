//- React Imports
import { useState } from 'react';

//- Component Imports
import { MintDropNFTBanner, Overlay, ConnectToWallet } from 'components';

//- Style Imports
import styles from './ClaimNFTContainer.module.scss';
import ClaimNFT from '../ClaimNFT/ClaimNFT';

export type ClaimNFTContainerProps = {};

const ClaimNFTContainer = ({}: ClaimNFTContainerProps) => {
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
						isClaimable={true}
						openConnect={openConnect}
						onClose={closeWizard}
					/>
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
