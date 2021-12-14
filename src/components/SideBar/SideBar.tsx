import { FC } from 'react';

import SideBarStyles from './SideBar.module.scss';

import marketIcon from './assets/icon_market.svg';
import stakingIcon from './assets/icon_staking.svg';

const SideBar: FC = () => {
	return (
		<div className={SideBarStyles.SideBar}>
			<div className={SideBarStyles.Navigator}>
				<div className={SideBarStyles.Icons}>
					<div className={SideBarStyles.Action} key="market">
						<div className={`${SideBarStyles.Hype} ${SideBarStyles.Selected}`}>
							<img alt="market icon" src={marketIcon} />
						</div>
						{/* TODO: Fix overlaying issue with Name */}
						<div className={SideBarStyles.Name}>Market</div>
					</div>
					<div className={SideBarStyles.Action} key="staking">
						<div className={SideBarStyles.Hype}>
							<img alt="staking icon" src={stakingIcon} />
						</div>
						<div className={SideBarStyles.Name}>Staking</div>
					</div>
				</div>
			</div>
		</div>
	);
};

export default SideBar;
