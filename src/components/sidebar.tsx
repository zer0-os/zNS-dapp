import { FC, useState } from 'react';
import _ from 'lodash';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useDomainCache } from '../lib/useDomainCache';
import { useLocation } from 'react-router-dom';
import { Tooltip } from 'antd';
import './css/sidebar.scss';
import feedSelect from './css/img/feed.png';
import tvSelect from './css/img/tv-button-borderless-blue.png';
import tv from './css/img/tv-button-borderless.png';
import feed from './css/img/feedgrey.png';

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
      <div className="sidebarNav">
        {/* <div className="dotContainer">
          <div className="dot"></div>
          <div className="dot selectedDot"></div>
          <div className="dot"></div>
          <div className="dot"></div>
        </div> */}
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
          {/* <div className="iconRow">
            <div className="sbimgContainer">
              {' '}
              <img src={geopin} alt="" />
            </div>
          </div>
          <div className="iconRow">
            <div className="sbimgContainer">
              {' '}
              <img src={galaxycircle} alt="" />
            </div>
          </div> */}
        </div>
      </div>
      {/* <div className="profile">
        <img src={elon} alt="" className="profilepic" />
        <div className="buttons">
          <button className="wallet"></button>
          <button className="darkmode-toggle"></button>
        </div>
      </div> */}
    </div>
  );
};

export default Sidebar;
