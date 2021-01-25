import React, { FC, useCallback, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useZnsContracts } from '../lib/contracts';
import { useDomainCache } from '../lib/useDomainCache';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Modal, Button } from 'antd';

const Owned: FC = () => {
  const context = useWeb3React<Web3Provider>();
  const [isOwnedVisible, setOwnedVisible] = useState(false);
  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;
  const { controlled } = useDomainCache();

  if (controlled.isNothing()) return <p>User owns no domains.</p>;

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
    <div id="ownedContainer">
      <button onClick={showOwner}>Profile</button>

      <Modal visible={isOwnedVisible} onOk={ownerOk} onCancel={ownerCancel}>
        <div>Domains Owned by {account}:</div>
        <div>
          {controlled.value.map((control) => {
            return (
              <div key={control.domain}>
                <Link
                  to={'/' + control.domain.replace(/\./, '/')}
                  //   key={control.domain}
                >
                  {control.domain}
                </Link>
              </div>
            );
          })}
        </div>
      </Modal>
    </div>
  );
};

export default Owned;
