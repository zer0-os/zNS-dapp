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
import Claim from './claims';

interface ProfileProps {
  domain: string;
}

const Profile: FC<ProfileProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const [isOwnedVisible, setOwnedVisible] = useState(false);
  const [count, setCount] = useState(0);
  const contracts = useZnsContracts();
  const { useDomain, owned, incomingApprovals } = useDomainStore();
  const { domain, refetchDomain } = useDomain(_domain);
  const { library, account, active, chainId } = context;

  const outgoingApprovals = owned.isJust()
    ? owned.value.filter((control) => {
        return control.approval.isJust();
      })
    : null;

  console.log(outgoingApprovals);
  console.log(outgoingApprovals?.length, 'MANYAPPROVALS');

  const [outgoingPendingCount, setOutgoingPendingCount] = useState(0);

  const showOwner = () => {
    setOwnedVisible(true);
  };

  const ownerOk = () => {
    setOwnedVisible(false);
  };

  const ownerCancel = () => {
    setOwnedVisible(false);
  };

  if (owned.isNothing()) return null;
  return (
    <>
      <button className="owned-btn" onClick={showOwner}>
        Profile
      </button>

      <Modal visible={isOwnedVisible} onOk={ownerOk} onCancel={ownerCancel}>
        <div>Domains Owned by {account}:</div>

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
        <div>
          Outgoing Approvals: {outgoingApprovals ? outgoingApprovals.length : 0}
        </div>

        <div>
          {' '}
          Incoming Approvals:{' '}
          {incomingApprovals.isJust() ? incomingApprovals.value.length : 0}
        </div>
        <div>Pending Outgoing Approvals: {outgoingPendingCount}</div>

        <div>
          <Claim domain={_domain} />
        </div>
      </Modal>
    </>
  );
};

export default Profile;
