import { FC, useState } from 'react';
import _ from 'lodash';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useDomainCache } from '../../../lib/useDomainCache';
import { useLocation, Link } from 'react-router-dom';
import { Tooltip } from 'antd';
import './css/sidebar.scss';
import wilderLogo from '../../css/img/wilderlogo.png';

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
        <div className="middleNav border-primary">
          <div className="sideItem i1">
          </div>
          <div className="sideItem i2">
          </div>
          <div className="sideItem i3">
          </div>
          <div className="sideItem i4">
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
