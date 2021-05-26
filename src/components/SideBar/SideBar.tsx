import React from 'react';

import SideBarStyles from './SideBar.module.css';

import trendingIcon from './assets/trending.svg';
import discoverIcon from './assets/discover.svg';
import lendingIcon from './assets/lending.svg';
import governanceIcon from './assets/governance.svg';

const SideBar: React.FC = () => {
	return (
		<div className={SideBarStyles.SideBar}>
			<div className={`${SideBarStyles.Navigator}  border-primary blur`}>
				<ul className={SideBarStyles.Icons}>
					<li>
						<img alt="trending icon" src={trendingIcon} />
					</li>
					<li className={SideBarStyles.Selected}>
						<img alt="discover icon" src={discoverIcon} />
					</li>
					<li>
						<img alt="lending icon" src={lendingIcon} />
					</li>
					<li>
						<img alt="governance icon" src={governanceIcon} />
					</li>
				</ul>
			</div>
		</div>
	);
};

export default SideBar;
