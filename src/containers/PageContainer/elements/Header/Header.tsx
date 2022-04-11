import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';
import classnames from 'classnames';
import { useStaking } from 'lib/hooks/useStaking';
import { useMint } from 'lib/hooks/useMint';
import { useTransfer } from 'lib/hooks/useTransfer';
import { useNavbar } from 'lib/hooks/useNavbar';
import useMvpVersion from 'lib/hooks/useMvpVersion';
import { Maybe, DisplayParentDomain, Metadata } from 'lib/types';
import { ZNALink } from 'components';
import { useHeaderData, useHeaderHandlers } from './hooks';
import {
	SearchDomains,
	ConnectWalletButton,
	MintButton,
	StatusButtons,
	ProfileButton,
	InfoButton,
	HistoryButtons,
} from './elements';
import { Modal } from '../../PageContainer.constants';
import './_header.scss';

type HeaderProps = {
	pageWidth: number;
	znsDomain: Maybe<DisplayParentDomain>;
	domainMetadata: Maybe<Metadata>;
	account: Maybe<string>;
	isScrollDetectionDown: boolean;
	openModal: (modal?: Modal | undefined) => () => void;
};

export const Header: React.FC<HeaderProps> = ({
	pageWidth,
	znsDomain,
	domainMetadata,
	account,
	isScrollDetectionDown,
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

	const { localState, localActions, formattedData, refs } = useHeaderData({
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
		<div
			className={classnames('header__outer-container', {
				'header__container--is-searching': isSearching,
				'header__container--is-active': localState.isSearchInputHovered,
				'header__container--on-scroll-up': !isScrollDetectionDown,
				'header__container--on-scroll-down': isScrollDetectionDown,
			})}
		>
			<div className={'header__container'}>
				<div className="header__content">
					<div className="header__navigation">
						{/* History buttons */}
						{formattedData.showHistoryButtons && <HistoryButtons />}

						{/* Title Text */}
						{formattedData.showTitle && (
							<h1 className="header__navigation-title">{title}</h1>
						)}

						{!formattedData.showTitle && (
							<div className="ZNA__Container">
								{/* Zns Link */}
								{formattedData.showZnaLink && (
									<ZNALink
										className="header__navigation-zna-link"
										style={{ marginLeft: 16 }}
									/>
								)}

								{/* Search TextField */}
								<input
									className="header__navigation-search"
									onChange={handlers.handleOnSearchChange}
									onKeyUp={handlers.handleOnSearchEscape}
									value={localState.searchQuery}
									type="text"
									onFocus={handlers.handleOnSearchOpen}
									onBlur={handlers.handleOnSearchClose}
									onMouseEnter={handlers.handleOnSearchEnter}
									onMouseLeave={handlers.handleOnSearchLeave}
									ref={refs.searchInputRef}
									placeholder={formattedData.searchPlaceholder}
								/>
							</div>
						)}
					</div>

					{/* Search Domains List */}
					{isSearching && (
						<SearchDomains searchQuery={localState.searchQuery} />
					)}
				</div>
			</div>
			<div className="header__actions">
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

				{/* Buy token from external urls */}
				{/* {formattedData.showBuyTokenRedirect && <BuyTokenRedirect />} */}

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
		</div>
	);
};

export default Header;
