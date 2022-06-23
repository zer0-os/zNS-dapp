//- React Imports
import React, { useCallback, useState } from 'react';
import { useHistory } from 'react-router-dom';

//- Library Imports
import classnames from 'classnames';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers/lib/web3-provider';
import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';
import { useEagerConnect } from 'lib/hooks/provider-hooks';
import { usePageWidth } from 'lib/hooks/usePageWidth';
import { useUpdateEffect } from 'lib/hooks/useUpdateEffect';
import { useNotification } from 'lib/hooks/useNotification';
import { useMint } from 'lib/hooks/useMint';
import { useStaking } from 'lib/hooks/useStaking';
import useScrollDetection from 'lib/hooks/useScrollDetection';

//- Components Imports
import {
	SideBar,
	ScrollToTop,
	NotificationDrawer,
	Image,
	WilderIcon,
} from 'components';
import { Header, Modals, useModal, Actions, Touchbar } from './elements';

//- Constants Imports
import { LOCAL_STORAGE_KEYS } from 'constants/localStorage';
import { WALLETS } from 'constants/wallets';
import { WALLET_NOTIFICATIONS } from 'constants/notifications';
import { Modal } from './PageContainer.constants';
import logo from 'assets/WWLogo_SVG.svg';

import warningIcon from './warning.svg';

//- Styles Imports
import styles from './PageContainer.module.scss';

const PageContainer: React.FC = ({ children }) => {
	/**
	 * Hooks Data
	 */
	const history = useHistory();
	const { account, active } = useWeb3React<Web3Provider>();
	const triedEagerConnect = useEagerConnect();
	const globalDomain = useCurrentDomain();
	const {
		domain: znsDomain,
		domainMetadata,
		loading,
		refetch,
	} = useCurrentDomain();
	const { minted } = useMint();
	const { fulfilled: stakingFulFilled } = useStaking();
	const { addNotification } = useNotification();
	const { pageWidth } = usePageWidth();
	const { modal, openModal, closeModal } = useModal();

	// Scroll Detection
	const [isScrollDetectionDown, setScrollDetectionDown] = useState(false);
	useScrollDetection(setScrollDetectionDown);

	/**
	 * Callback Functions
	 */

	const handleForceBackHome = useCallback(() => {
		if (!loading && !znsDomain) {
			history.push(globalDomain.app);
		}
	}, [loading, znsDomain, globalDomain, history]);

	const handleWalletChanges = useCallback(() => {
		if (
			Object.values(WALLETS).includes(
				localStorage.getItem(LOCAL_STORAGE_KEYS.CHOOSEN_WALLET) as WALLETS,
			) &&
			!active &&
			triedEagerConnect
		) {
			localStorage.removeItem(LOCAL_STORAGE_KEYS.CHOOSEN_WALLET);
		}

		if (triedEagerConnect)
			addNotification(
				active
					? WALLET_NOTIFICATIONS.CONNECTED
					: WALLET_NOTIFICATIONS.DISCONNECTED,
			);

		// Check if we need to close a modal
		if (modal === Modal.Transfer || modal === Modal.Mint) {
			closeModal();
		}
	}, [active, modal, triedEagerConnect, addNotification, closeModal]);

	/**
	 * Life Cycles
	 */
	useUpdateEffect(handleForceBackHome, [znsDomain, loading, globalDomain.app]);
	useUpdateEffect(handleWalletChanges, [active]);
	useUpdateEffect(refetch, [minted, stakingFulFilled]);

	return (
		<>
			<div className={styles.MaintenanceContainer}>
				{/* <div className={styles.FlexRowWrapper}> */}

				<article className={styles.Article}>
					<img alt="logo" src={logo} className={styles.Logo} />

					<h1 className={styles.Heading}>We&rsquo;ll be back soon!</h1>
					<div>
						<p>
							Sorry for the inconvenience. We&rsquo;re performing some
							maintenance at the moment. If you need to you can always follow us
							on <a href="https://discord.gg/7tyggH6eh9">Discord</a> for
							updates, otherwise we&rsquo;ll be back up shortly!
						</p>
						<p>&mdash; The Wilder World Team</p>
					</div>
				</article>
			</div>
		</>
	);

	// return (
	// 	<ScrollToTop>
	// 		<div className={classnames(styles.PageContainer)}>
	// 			Toast Notifications
	// 			<NotificationDrawer />

	// 			{/* App level Modals */}
	// 			<Modals pageWidth={pageWidth} modal={modal} closeModal={closeModal} />

	// 			<div className={styles.InnerContainer}>
	// 				<div className={styles.FlexRowWrapper}>
	// 					{/* App Sidebar */}
	// 					<SideBar />
	// 					<div className={styles.FlexColumnWrapper}>
	// 						{/* App Header */}
	// 						<Header
	// 							pageWidth={pageWidth}
	// 							znsDomain={znsDomain}
	// 							domainMetadata={domainMetadata}
	// 							account={account}
	// 							openModal={openModal}
	// 							isScrollDetectionDown={isScrollDetectionDown}
	// 						/>

	// 						{/* Children Components */}
	// 						<main className={styles.Main}>{children}</main>
	// 					</div>

	// 					{/* Header Actions - Desktop */}
	// 					<Actions
	// 						className={styles.Actions}
	// 						pageWidth={pageWidth}
	// 						znsDomain={znsDomain}
	// 						domainMetadata={domainMetadata}
	// 						account={account}
	// 						openModal={openModal}
	// 					/>
	// 				</div>
	// 			</div>
	// 		</div>
	// 		{/* Touchbar */}
	// 		<Touchbar />
	// 	</ScrollToTop>
	// );
};

export default PageContainer;
