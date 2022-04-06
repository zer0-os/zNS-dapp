import { FC } from 'react';

import SideBarStyles from './SideBar.module.scss';

import marketIcon from './assets/icon_market.svg';
import stakingIcon from './assets/icon_staking.svg';
import { useHistory } from 'react-router-dom';

const SideBar: FC = () => {
	const history = useHistory();
	// Can't use route match without being inside a route

	return (
		<div className={SideBarStyles.SideBar}>
			<div className={SideBarStyles.Navigator}>
				<div className={SideBarStyles.Icons}>
					<div
						className={SideBarStyles.Action}
						key="market"
						onClick={() => history.push('/market')}
					>
						<div
							className={`${SideBarStyles.Hype} ${
								history.location.pathname.indexOf('/market') > -1 &&
								SideBarStyles.Selected
							}`}
						>
							<img alt="market icon" src={marketIcon} />
						</div>
						{/* TODO: Fix overlaying issue with Name */}
						<div className={SideBarStyles.Name}>Market</div>
					</div>
					<div
						className={SideBarStyles.Action}
						key="staking"
						onClick={() => history.push('/staking')}
					>
						<div
							className={`${SideBarStyles.Hype} ${
								history.location.pathname.indexOf('/staking') > -1 &&
								SideBarStyles.Selected
							}`}
						>
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
