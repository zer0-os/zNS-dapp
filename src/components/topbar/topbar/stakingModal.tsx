import { FC, useState } from 'react';
import { useDomainCache } from '../../../lib/useDomainCache';
import Create from './create';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';

import SetImage from '../forms/set-image';
import './css/stakingModal.scss';

interface NestedProps {
  domain: string;
}

const Stakingview: FC<NestedProps> = ({ domain: _domain }) => {
  const [isStakeVisible, setStakeVisible] = useState(false);
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { domain } = domainContext;

  const showStake = () => {
    setStakeVisible(true);
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
  //

  //
  if (domain.isNothing()) return null;
  return (
    <div className="mintContainer">
      <form className="mintForm">
        <div className="mintBar">
          <div className="headerText">Mint A New NFT</div>
          <div className="subText">by **Artist**</div>
        </div>
        <div className="mintBodyContainer">
          <div className="mintMedia">
            <div className="mintMediaText">UPLOAD MEDIA FILE</div>
            {/* <SetImage domain={domain.value.domain} />{' '} */}
          </div>
          <div className="content">
            <div className="left">
              <div className="title">
                <div className="titleText">TITLE</div>
                <input
                  className="titleInput"
                  // placeholder="NFT TITLE"
                  type="text"
                />
              </div>
              <div className="story">
                <div className="storyText">STORY</div>
                <textarea
                  className="storyInput"
                  // placeholder="NFT STORY"
                ></textarea>
              </div>
            </div>
            <div className="right">
              <div className="image"></div>
            </div>
          </div>
          <div style={{ display: 'none' }}>
            <div>Your Bid</div>
            <input placeholder="Your Bid"></input>
            <div>
              {/* <button
                type="submit"
                onSubmit={handleSubmit(({ child }) => _create(child))}
              >
                {' '}
                Mint NFT
              </button>
              <input name={'child'} ref={register} placeholder="Domain" /> */}
              <Create
                props={''}
                domainId={_domain}
                domainContext={domainContext}
              />
            </div>
          </div>
          <div className="continueBar">
            <button
              type="button"
              onClick={showStake}
              className="continueButton"
            >
              {' '}
              Continue{' '}
            </button>
          </div>
          {isStakeVisible ? (
            <div>
              <div> Stake W </div>
              <div> YOUR BID</div>
              <input placeholder="Your Bid"></input>
              <Dropdown overlay={menu}>
                {/* eslint-disable-next-line jsx-a11y/anchor-is-valid*/}
                <a
                  className="ant-dropdown-link"
                  onClick={(e) => e.preventDefault()}
                >
                  CURRENCY <DownOutlined />
                </a>
              </Dropdown>
            </div>
          ) : null}
        </div>
      </form>
    </div>
  );
};
export default Stakingview;
