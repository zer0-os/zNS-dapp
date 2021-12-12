import { TitleBar, SideBar } from 'components';
import Staking from 'dapps/Staking';
import { ZNS } from 'pages';
import React, { useEffect, useMemo, useState } from 'react';

import styles from './Navigator.module.scss';
import classNames from 'classnames/bind';
import { StakingContainer } from 'containers/staking';

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
	const [isSearchActive, setIsSearchActive] = useState<boolean>(false);
	const [selectedApp, setSelectedApp] = useState<App>(App.Staking);

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
					canGoBack={true}
					canGoForward={true}
					onBack={() => {}}
					onForward={() => {}}
					isSearchActive={false}
					setIsSearchActive={setIsSearchActive}
				>
					TEST
				</TitleBar>
			</nav>
			{/* <nav className={cx(styles.Left)}>
				<SideBar />
			</nav> */}
			<main className={'page-spacing'}>{app}</main>
		</>
	);
};

export default Navigator;
