import React from 'react'

import SideBarStyles from './SideBar.module.css'

import hand from './assets/hand.svg'
import scales from './assets/scales.svg'
import graph from './assets/graph.svg'
import telescope from './assets/telescope.svg'

const SideBar = (props) => {

    return (
    	<div className={SideBarStyles.SideBar}>
    		<div className={`${SideBarStyles.Navigator}  border-primary blur`}>
				<ul className={SideBarStyles.Icons}>
					<li></li>
					<li></li>
					<li></li>
					<li></li>
				</ul>
			</div>
    	</div>
    	                    
    )
}

export default SideBar