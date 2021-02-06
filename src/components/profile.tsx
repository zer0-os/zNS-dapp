import React, { FC, useState, useCallback } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useZnsContracts } from '../lib/contracts';
import { useDomainCache } from '../lib/useDomainCache';
import { useDomainStore } from '../lib/useDomainStore';
import { Modal, Button } from 'antd';
import Create from './create';
import Transfer from './transferDomains';
import Approve from './approval';
import { Link } from 'react-router-dom';

const Profile: FC = () => {
  const context = useWeb3React<Web3Provider>();
  const [isOwnedVisible, setOwnedVisible] = useState(false);
  const [count, setCount] = useState(4);
  const contracts = useZnsContracts();
  const { useDomain } = useDomainCache();
  const { library, account, active, chainId } = context;
  const { owned, incomingApprovals } = useDomainStore();

  const outgoingApprovals = owned.isJust()
    ? owned.value.filter((control) => {
        return control.approval.isJust();
      })
    : null;

  console.log(outgoingApprovals);
  console.log(outgoingApprovals?.length, 'MANYAPPROVALS');

  const [outgoingPendingCount, setOutgoingPendingCount] = useState(0);

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
        {console.log('OWNED ', owned)}
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
