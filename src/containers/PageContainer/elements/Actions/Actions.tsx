//- React Imports
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

//- Library Imports
import { useStaking } from 'lib/hooks/useStaking';
import { useMint } from 'lib/hooks/useMint';
import { useTransfer } from 'lib/hooks/useTransfer';
import { useNavbar } from 'lib/hooks/useNavbar';
import useMvpVersion from 'lib/hooks/useMvpVersion';
import { Maybe, DisplayParentDomain, Metadata } from 'lib/types';

//- Hooks Imports
import { useHeaderData, useHeaderHandlers } from '../Header/hooks';

//- Components Imports
import {
	ConnectWalletButton,
	MintButton,
	StatusButtons,
	ProfileButton,
	InfoButton,
} from '../Header/elements';

//- Constants Imports
import { Modal } from '../../PageContainer.constants';

//- Styles Imports
import styles from './Actions.module.scss';

type ActionsProps = {
	pageWidth: number;
	znsDomain: Maybe<DisplayParentDomain>;
	domainMetadata: Maybe<Metadata>;
	account: Maybe<string>;
	openModal: (modal?: Modal | undefined) => () => void;
	className: string;
};

export const Actions: React.FC<ActionsProps> = ({
	pageWidth,
	znsDomain,
	domainMetadata,
	account,
	openModal,
	className,
}) => {
	const history = useHistory();
	const location = useLocation();
	const { mvpVersion } = useMvpVersion();

	const { requesting: stakeRequesting, requested: stakeRequested } =
		useStaking();

	const { minting, minted } = useMint();
	const { transferring, transferred } = useTransfer();
	const { title, isSearching, setNavbarSearchingStatus } = useNavbar();

	const { localActions, formattedData, refs } = useHeaderData({
		props: {
			pageWidth,
			znsDomain,
			domainMetadata,
			account,
			navbar: {
				title,
				isSearching,
			},
			mvpVersion,
		},
	});

	const handlers = useHeaderHandlers({
		props: {
			history,
			location,
		},
		localActions,
		reduxActions: {
			setNavbarSearchingStatus,
		},
		refs,
	});

	return (
		<div className={className}>
			{/* Connect Wallet Button */}
			{formattedData.showConnectWalletButton && (
				<ConnectWalletButton
					className={styles.ConnectButton}
					onConnectWallet={openModal(Modal.Wallet)}
					isDesktop={formattedData.isDesktop}
				/>
			)}

			{/* Mint button */}
			{formattedData.showMintButton && (
				<MintButton
					isMinting={minting.length > 0}
					onClick={openModal(Modal.Mint)}
				/>
			)}

			{/* Status Buttons */}
			{formattedData.showStatusButtons && (
				<StatusButtons
					statusCounts={{
						minting: minting.length,
						minted: minted.length,
						stakeRequesting: stakeRequesting.length,
						stakeRequested: stakeRequested.length,
						transferring: transferring.length,
						transferred: transferred.length,
					}}
					onOpenProfile={handlers.handleOnOpenProfile}
				/>
			)}

			{/* Profile Button */}
			{formattedData.showProfileButton && (
				<ProfileButton onOpenProfile={handlers.handleOnOpenProfile} />
			)}

			{/* Info Button */}
			{formattedData.showInfoButton && (
				<InfoButton
					isDesktop={formattedData.isDesktop}
					onConnectWallet={openModal(Modal.Wallet)}
				/>
			)}
		</div>
	);
};

export default Actions;
