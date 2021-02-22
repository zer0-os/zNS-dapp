import React, { FC, useState, useCallback } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useZnsContracts } from '../../lib/contracts';
import { useDomainCache } from '../../lib/useDomainCache';
import { useDomainStore } from '../../lib/useDomainStore';
import { Modal, Button } from 'antd';
import Create from './create';
import { Link, useLocation } from 'react-router-dom';
import { Menu, Dropdown } from 'antd';
import { DownOutlined } from '@ant-design/icons';
import _ from 'lodash';
import SetImage from './forms/set-image';
import * as z from 'zod';
import { zodResolver } from '../../lib/validation/zodResolver';
import { useForm } from 'react-hook-form';
import { subdomainRegex } from '../../lib/validation/validators';
import '../css/stakingModal.scss';
const { SubMenu } = Menu;

interface NestedProps {
  domain: string;
}

const schema = z.object({
  child: z
    .string()
    .regex(subdomainRegex, 'Subdomain must only contain alphanumeric letters'),
});

const Stakingview: FC<NestedProps> = ({ domain: _domain }) => {
  const [isSubdomainVisible, setSubdomainVisible] = useState(false);
  const [isTransferVisible, setTransferVisible] = useState(false);
  const [isProfileVisible, setProfileVisible] = useState(true);
  const [imageUrl, setImageUrl] = useState('ipfs://Qmimage');
  const context = useWeb3React<Web3Provider>();
  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain, refetchDomain } = domainContext;
  const { register, handleSubmit, errors } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  const location = useLocation();

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

  // const _create = useCallback(
  //   (child: string) => {
  //     if (account && contracts.isJust() && domain.isJust())
  //       contracts.value.registry
  //         .createDomain(
  //           domain.value.domain === 'ROOT'
  //             ? child
  //             : domain.value.domain + '.' + child,
  //           account,
  //           account,
  //           'ipfs://Qmresolver',
  //           imageUrl,
  //         )
  //         .then((txr) => txr.wait(1))
  //         .then(() => {
  //           refetchDomain();
  //         });
  //   },
  //   [contracts, account],
  // );

  const showSubdomain = () => {
    setSubdomainVisible(true);
  };

  const subdomainOk = () => {
    setSubdomainVisible(false);
  };

  const subdomainCancel = () => {
    setSubdomainVisible(false);
  };

  const showTransfer = () => {
    setTransferVisible(true);
  };

  const transferOk = () => {
    setTransferVisible(false);
  };

  const transferCancel = () => {
    setTransferVisible(false);
  };

  const showProfile = () => {
    setProfileVisible(true);
  };

  const profileOk = () => {
    setProfileVisible(false);
  };

  const profileCancel = () => {
    setProfileVisible(false);
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
            <SetImage domain={domain.value.domain} />{' '}
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
              <Create domainId={_domain} domainContext={domainContext} />
            </div>
            <Dropdown overlay={menu}>
              <a
                className="ant-dropdown-link"
                onClick={(e) => e.preventDefault()}
              >
                CURRENCY <DownOutlined />
              </a>
            </Dropdown>
          </div>
          <div className="continueBar">
            <button className="continueButton"> Continue </button>
          </div>
        </div>
      </form>
    </div>
  );
};
export default Stakingview;
