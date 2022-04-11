import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import { useStaking } from 'lib/hooks/useStaking';
import { useMint } from 'lib/hooks/useMint';
import { useTransfer } from 'lib/hooks/useTransfer';
import { useNavbar } from 'lib/hooks/useNavbar';
import useMvpVersion from 'lib/hooks/useMvpVersion';
import { Maybe, DisplayParentDomain, Metadata } from 'lib/types';

import { useHeaderData, useHeaderHandlers } from '../Header/hooks';
import {
	ConnectWalletButton,
	MintButton,
	StatusButtons,
	ProfileButton,
	InfoButton,
} from '../Header/elements';
import { Modal } from '../../PageContainer.constants';
import styles from '../../PageContainer.module.scss';

type HeaderProps = {
	pageWidth: number;
	znsDomain: Maybe<DisplayParentDomain>;
	domainMetadata: Maybe<Metadata>;
	account: Maybe<string>;
	openModal: (modal?: Modal | undefined) => () => void;
};

export const Actions: React.FC<HeaderProps> = ({
	pageWidth,
	znsDomain,
	domainMetadata,
	account,
	openModal,
}) => {
	const history = useHistory();
	const location = useLocation();
	const { mvpVersion } = useMvpVersion();

	const { requesting: stakeRequesting, requested: stakeRequested } =
		useStaking();

	const { minting, minted } = useMint();
	const { transferring } = useTransfer();
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
		<div className={styles.Actions}>
			{/* Connect Wallet Button */}
			{formattedData.showConnectWalletButton && (
				<ConnectWalletButton
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
