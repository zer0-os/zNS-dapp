import { FC, useState } from 'react';
import _ from 'lodash';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useDomainCache } from '../../../lib/useDomainCache';
import { useLocation, Link } from 'react-router-dom';
import { Tooltip } from 'antd';
import './css/sidebar.scss';
import wilderLogo from '../../css/img/wilderlogo.png';
// import trending from './css/img/trending.png';
// import trendingS from './css/img/trending-selected.png';
// import explore from './css/img/explorer.png';
// import exploreS from './css/img/explorer-selected.png';
// import lending from './css/img/lending.png';
// import lendingS from './css/img/lending-selected.png';
// import gov from './css/img/governance.png';
// import govS from './css/img/governance-selected.png';
import trending from './img/sidebar/Trending/trend-default.png';
import trendingD from './img/sidebar/Trending/trend-down.png';
import trendingH from './img/sidebar/Trending/trend-hover.png';
import trendingS from './img/sidebar/Trending/trend-select.png';
import explorer from './img/sidebar/Explorer/explorer-default.png';
import explorerD from './img/sidebar/Explorer/explorer-down.png';
import explorerH from './img/sidebar/Explorer/explorer-hover.png';
import explorerS from './img/sidebar/Explorer/explorer-select.png';
import lending from './img/sidebar/Lending/lend-default.png';
import lendingD from './img/sidebar/Lending/lend-down.png';
import lendingH from './img/sidebar/Lending/lend-hover.png';
import lendingS from './img/sidebar/Lending/lend-select.png';
import gov from './img/sidebar/Governance/gov-default.png';
import govD from './img/sidebar/Governance/gov-down.png';
import govH from './img/sidebar/Governance/gov-hover.png';
import govS from './img/sidebar/Governance/gov-select.png';

const Sidebar: FC = () => {
  const context = useWeb3React<Web3Provider>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { account, active } = context;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { useDomain } = useDomainCache();
  //   const domainContext = useDomain(_domain);
  //   const { domain } = domainContext;
  const location = useLocation();
  const [selected, setSelected] = useState('trending');
  const [hover, setHover] = useState('');
  const [down, setDown] = useState('');

  const text2 = <span style={{ color: '#fff' }}>Discover</span>;
  const text1 = <span style={{ color: '#fff' }}>Directory</span>;
  const bright = 'rgb(145, 85, 230)';

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const routes = _.transform(
    location.pathname
      .substr(1)
      .split('.')
      .filter((s) => s !== ''),
    (acc: [string, string][], val, i) => {
      let next = 0 < i ? acc[i - 1][1] + '.' + val : val;
      acc.push([val, next]);
    },
  );

  const [connect, setConnect] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isWalletVisible, setWalletVisible] = useState(false);
  const [sideToggle, setSideToggle] = useState('domain');

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onClick = () => {
    setConnect(!connect);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const showWallet = () => {
    setWalletVisible(true);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const walletOk = () => {
    setWalletVisible(false);
  };
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const walletCancel = () => {
    setWalletVisible(false);
  };

  return (
    <div className="sidebarContainer">
      <div className="sidebarContainer">
        <Link to={'/'} className="topLogo">
          <img src={wilderLogo} alt="" />
        </Link>
        <div className="middleNav">
          <div className="sideItem i1">
            <img
              onMouseDown={() => setDown('trending')}
              onMouseUp={() => setDown('')}
              onMouseEnter={() => setHover('trending')}
              onMouseLeave={() => {
                setDown('');
                setHover('');
              }}
              onClick={() => setSelected('trending')}
              src={
                down === 'trending'
                  ? trendingD
                  : selected === 'trending'
                  ? trendingS
                  : hover === 'trending'
                  ? trendingH
                  : trending
              }
              alt=""
            />
          </div>
          <div className="sideItem i2">
            <img
              onMouseDown={() => setDown('explorer')}
              onMouseUp={() => setDown('')}
              onMouseEnter={() => setHover('explorer')}
              onMouseLeave={() => {
                setDown('');
                setHover('');
              }}
              onClick={() => setSelected('explorer')}
              src={
                down === 'explorer'
                  ? explorerD
                  : selected === 'explorer'
                  ? explorerS
                  : hover === 'explorer'
                  ? explorerH
                  : explorer
              }
              alt=""
            />
          </div>
          <div className="sideItem i3">
            <img
              onMouseDown={() => setDown('lending')}
              onMouseUp={() => setDown('')}
              onMouseEnter={() => setHover('lending')}
              onMouseLeave={() => {
                setDown('');
                setHover('');
              }}
              onClick={() => setSelected('lending')}
              src={
                down === 'lending'
                  ? lendingD
                  : selected === 'lending'
                  ? lendingS
                  : hover === 'lending'
                  ? lendingH
                  : lending
              }
              alt=""
            />
          </div>
          <div className="sideItem i4">
            <img
              onMouseDown={() => setDown('gov')}
              onMouseUp={() => setDown('')}
              onMouseEnter={() => setHover('gov')}
              onMouseLeave={() => {
                setDown('');
                setHover('');
              }}
              onClick={() => setSelected('gov')}
              src={
                down === 'gov'
                  ? govD
                  : selected === 'gov'
                  ? govS
                  : hover === 'gov'
                  ? govH
                  : gov
              }
              alt=""
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
