import React, { FC, useCallback, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Modal, Button, Badge } from 'antd';
import { useZnsContracts } from '../lib/contracts';
import { domainCacheContext, useDomainCache } from '../lib/useDomainCache';
import Approve from './approval';
import { domain } from 'process';
import NFTview from './nft-view';

const Profile: FC = () => {
  const context = useWeb3React<Web3Provider>();
  const [isOwnedVisible, setOwnedVisible] = useState(false);
  const [count, setCount] = useState(4);
  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;
  const { owned } = useDomainCache();

  if (owned.isNothing()) return <p>User owns no domains.</p>;

  const showOwner = () => {
    setOwnedVisible(true);
  };

  const ownerOk = () => {
    setOwnedVisible(false);
  };

  const ownerCancel = () => {
    setOwnedVisible(false);
  };
  return (
    <>
      <button className="owned-btn" onClick={showOwner}>
        Profile
      </button>

      <Modal visible={isOwnedVisible} onOk={ownerOk} onCancel={ownerCancel}>
        <div>Domains Owned by {account}:</div>
        <button onClick={() => setCount(count * 0)}>
          {' '}
          reset notifications
        </button>
        <div>
          {owned.value.map((control) => {
            return (
              <div key={control.domain}>
                <Link
                  to={'/' + control.domain}
                  //   key={control.domain}
                >
                  {control.domain}
                </Link>
              </div>
            );
          })}
        </div>
      </Modal>
    </>
  );
};

export default Profile;
