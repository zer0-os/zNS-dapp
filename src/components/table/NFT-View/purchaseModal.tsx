import { FC, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useZnsContracts } from '../../../lib/contracts';
import { useDomainStore } from '../../../lib/useDomainStore';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import { useLocation } from 'react-router-dom';
import '../../css/profile.scss';
import '../../css/profile-grid.scss';

const Purchase: FC = () => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const context = useWeb3React<Web3Provider>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPurchaseVisible, setPurchaseVisible] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [text, setText] = useState('Copied');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [count, setCount] = useState(0);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [size, setSize] = useState();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const contracts = useZnsContracts();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { owned, incomingApprovals } = useDomainStore();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const location = useLocation();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const showPurchase = () => {
    setPurchaseVisible(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const purchaseOk = () => {
    setPurchaseVisible(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
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
        {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
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
