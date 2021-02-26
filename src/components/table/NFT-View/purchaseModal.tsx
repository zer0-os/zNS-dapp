import React, { FC, useState, useCallback, useMemo } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useZnsContracts } from '../../../lib/contracts';
import { useDomainCache } from '../../../lib/useDomainCache';
import { useDomainStore } from '../../../lib/useDomainStore';
import { Modal, Button, Tabs, Radio, Space, Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import { Link, useLocation } from 'react-router-dom';
import '../../css/profile.scss';
import { domain } from 'process';
import elon from '../../css/img/elon.jpg';
import '../../css/profile-grid.scss';

import TableImage from '../../table/table-image';
import { getAddress } from 'ethers/lib/utils';
import { Domain } from 'domain';
import { string } from 'zod';
const { TabPane } = Tabs;
let ClipboardButton = require('react-clipboard.js');

const Purchase: FC = () => {
  const context = useWeb3React<Web3Provider>();
  const [isPurchaseVisible, setPurchaseVisible] = useState(false);
  const [text, setText] = useState('Copied');
  const [count, setCount] = useState(0);
  const [size, setSize] = useState();
  const contracts = useZnsContracts();
  const { owned, incomingApprovals } = useDomainStore();
  const location = useLocation();

  const showPurchase = () => {
    setPurchaseVisible(true);
  };

  const purchaseOk = () => {
    setPurchaseVisible(false);
  };

  const purchaseCancel = () => {
    setPurchaseVisible(false);
  };

  const menu = (
    <Menu>
      <Menu.ItemGroup>
        <Menu.Item>Wild Token</Menu.Item>
        <Menu.Item>Ethereum</Menu.Item>
        <Menu.Item>Infinity</Menu.Item>
      </Menu.ItemGroup>
    </Menu>
  );

  return (
    <>
      <div>Your Bid</div>
      <input placeholder="your bid"></input>

      <Dropdown overlay={menu}>
        <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
          CURRENCY <DownOutlined />
        </a>
      </Dropdown>

      <button>cancel</button>
      <button>place bid</button>
    </>
  );
};

export default Purchase;
