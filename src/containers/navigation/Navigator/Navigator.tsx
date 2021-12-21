import { TitleBar, SideBar, ConnectToWallet } from 'components';
import Staking from 'dapps/Staking';
import { ZNS } from 'pages';
import React, { useEffect, useMemo, useState } from 'react';

import NavProvider, { useNav } from 'lib/providers/NavProvider';

import styles from './Navigator.module.scss';
import classNames from 'classnames/bind';
import { StakingContainer } from 'containers/staking';
import { useEagerConnect } from 'lib/hooks/provider-hooks';
import { ConnectWalletButton } from 'containers';
import { useWeb3React } from '@web3-react/core';
import { useChainSelector } from 'lib/providers/ChainSelectorProvider';

type NavigatorProps = {
	domain: string;
};

enum App {
	Market,
	Staking,
}

var lastY = 0; // Just a global variable to stash last scroll position
const cx = classNames.bind(styles);

const Navigator: React.FC<NavigatorProps> = ({ domain }) => {
	const { account, chainId } = useWeb3React();

	const { location } = useNav();

	const [selectedApp, setSelectedApp] = useState<App>(App.Staking);

	useEagerConnect(); // This line will try auto-connect to the last wallet only if the user hasnt disconnected

	//- Chain Selection (@todo: refactor to provider)
	const chainSelector = useChainSelector();
	React.useEffect(() => {
		if (chainId && chainSelector.selectedChain !== chainId) {
			chainSelector.selectChain(chainId);
		}
	}, [chainId]);

	// Hiding NavBar
	const body = document.getElementsByTagName('body')[0];
	const [hideHeader, setHideHeader] = useState(false);
	const handleScroll = () => {
		if (body.scrollTop > 60 && body.scrollTop > lastY) {
			// Going down and at least 60 pixels
			lastY = body.scrollTop;
			setHideHeader(true);
		} else if (lastY - body.scrollTop >= 10) {
			// Going up and more than 10 pixel
			lastY = body.scrollTop;
			setHideHeader(false);
		}
	};

	useEffect(() => {
		body.addEventListener('scroll', handleScroll);
		return () => body.removeEventListener('scroll', handleScroll);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	// App to display
	const app: React.ReactNode = useMemo(() => {
		switch (selectedApp) {
			case App.Market:
				return <ZNS domain={domain} />;
			case App.Staking:
				return <Staking />;
		}
	}, [selectedApp]);

	return (
		<>
			<nav
				className={cx(styles.Top, {
					Hidden: hideHeader,
				})}
			>
				<TitleBar
					className={'nav'}
					domain={domain}
					title={location || 'Staking'}
					hideNavigationButtons
					canGoBack={true}
					canGoForward={true}
					onBack={() => {}}
					onForward={() => {}}
					isSearchActive={false}
					setIsSearchActive={() => {}}
				>
					{!account && <ConnectWalletButton>Connect</ConnectWalletButton>}
				</TitleBar>
			</nav>
			{/* <nav className={cx(styles.Left)}>
				<SideBar />
			</nav> */}
			<main className={'page-spacing'}>{app}</main>
		</>
	);
};

const WrappedNavigator = (props: NavigatorProps) => {
	return (
		<NavProvider>
			<Navigator {...props} />
		</NavProvider>
	);
};

export default WrappedNavigator;
