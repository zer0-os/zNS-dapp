import { FC } from 'react';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import './css/profile.scss';
import '../../topbar/profile/profile-grid.scss';

const Purchase: FC = () => {
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
