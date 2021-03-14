import { FC, useState } from 'react';
import _ from 'lodash';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useDomainCache } from '../lib/useDomainCache';
import { useLocation } from 'react-router-dom';
import { Tooltip } from 'antd';
import './css/sidebar.scss';
import wilderLogo from './css/img/wilderlogo.png';
import trending from './css/img/trending.png';
import trendingS from './css/img/trending-selected.png';
import explore from './css/img/explorer.png';
import exploreS from './css/img/explorer-selected.png';
import lending from './css/img/lending.png';
import lendingS from './css/img/lending-selected.png';
import gov from './css/img/governance.png';
import govS from './css/img/governance-selected.png';

const Sidebar: FC = () => {
  const context = useWeb3React<Web3Provider>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { account, active } = context;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { useDomain } = useDomainCache();
  //   const domainContext = useDomain(_domain);
  //   const { domain } = domainContext;
  const location = useLocation();

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
        <div className="topLogo">
          <img src={wilderLogo} alt="" />
        </div>
        <div className="middleNav">
          <div className="sideItem i1">
            {/* <div> */}
            <img src={trending} alt="" />
            {/* <img src={trendingS} alt="" /> */}
            {/* </div> */}
          </div>
          <div className="sideItem i2">
            <img src={explore} alt="" />
          </div>
          <div className="sideItem i3">
            <img src={lending} alt="" />
          </div>
          <div className="sideItem i4">
            <img src={gov} alt="" />
          </div>
        </div>
      </div>

      {/* depricated */}
      {/* <div className="sidebarNav">
       
        <div className="icons">
          <div className="iconRow">
            <Tooltip
              color={bright}
              className="tt"
              placement="right"
              title={text1}
            >
              <div
                onClick={() => setSideToggle('domain')}
                className={`sbimgContainer ${
                  sideToggle === 'domain' ? 'selectedSideBar' : null
                }`}
              >
                {' '}
                <img src={sideToggle === 'domain' ? tvSelect : tv} alt="" />
              </div>
            </Tooltip>
          </div>
          <div className="iconRow">
            <Tooltip
              color={bright}
              className="tt"
              placement="right"
              title={text2}
            >
              <div
                onClick={() => setSideToggle('global')}
                className={`sbimgContainer ${
                  sideToggle === 'global' ? 'selectedSideBar' : null
                }`}
              >
                {' '}
                <img src={sideToggle === 'global' ? feedSelect : feed} alt="" />
              </div>
            </Tooltip>
          </div>
         
        </div>
      </div> */}
    </div>
  );
};

export default Sidebar;
