import React from 'react'

import SideBarStyles from './SideBar.module.css'

import trendingIcon from './assets/trending.svg'
import discoverIcon from './assets/discover.svg'
import lendingIcon from './assets/lending.svg'
import governanceIcon from './assets/governance.svg'

const SideBar: React.FC = () => {

    return (
    	<div className={SideBarStyles.SideBar}>
    		<div className={`${SideBarStyles.Navigator}  border-primary blur`}>
				<ul className={SideBarStyles.Icons}>
					<li><img src={trendingIcon} /></li>
					<li className={SideBarStyles.Selected}><img src={discoverIcon} /></li>
					<li><img src={lendingIcon} /></li>
					<li><img src={governanceIcon} /></li>
				</ul>
			</div>
    	</div>
    	                    
    )
}

export default SideBar