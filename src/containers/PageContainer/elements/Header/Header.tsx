//- React Imports
import React from 'react';
import { useHistory, useLocation } from 'react-router-dom';

//- library Imports
import classnames from 'classnames';
import { useNavbar } from 'lib/hooks/useNavbar';
import useMvpVersion from 'lib/hooks/useMvpVersion';
import { Maybe, DisplayParentDomain, Metadata } from 'lib/types';

//- Components Imports
import { ZNALink } from 'components';
import { SearchDomains, HistoryButtons, ConnectWalletButton } from './elements';
import { Actions } from '../Actions';

//- Hooks Imports
import { useHeaderData, useHeaderHandlers } from './hooks';

//- Constants Imports
import { Modal } from '../../PageContainer.constants';
import { ROUTES } from 'constants/routes';

//- Styles Imports
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
	const isProfileRoute = location.pathname.includes(ROUTES.PROFILE);
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
							<div
								className={`${'ZNA__Container'} ${
									isSearching ? 'ZNA__Container-searching' : ''
								}`}
							>
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
								{isSearching && (
									<SearchDomains searchQuery={localState.searchQuery} />
								)}
							</div>
						)}
					</div>
					{/* Search Domains List */}

					{/* Display Disconnect Button Mobile */}
					{isProfileRoute && account && (
						<div className="header__content-disconnect-button-container">
							<ConnectWalletButton className="header__content-disconnect-button" />
						</div>
					)}
				</div>
			</div>
			{/* Header Actions - Mobile / Tablet */}
			<Actions
				className="header__actions"
				pageWidth={pageWidth}
				znsDomain={znsDomain}
				domainMetadata={domainMetadata}
				account={account}
				openModal={openModal}
			/>
		</div>
	);
};

export default Header;
