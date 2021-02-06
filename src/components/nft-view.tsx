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
import Outgoing from './outGoingApproval';

interface ProfileProps {
  domain: string;
}

const NFTview: FC<ProfileProps> = ({ domain: _domain }) => {
  const [isSubdomainVisible, setSubdomainVisible] = useState(false);
  const [isTransferVisible, setTransferVisible] = useState(false);
  const [isProfileVisible, setProfileVisible] = useState(false);
  const context = useWeb3React<Web3Provider>();
  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;

  const { owned, incomingApprovals } = useDomainStore();

  const outgoingApprovals = owned.isJust()
    ? owned.value.filter((control) => {
        return control.approval.isJust();
      })
    : null;

  console.log(outgoingApprovals);
  console.log(outgoingApprovals?.length, 'MANYAPPROVALS');

  const [outgoingPendingCount, setOutgoingPendingCount] = useState(0);

  if (domain.isNothing()) return <p>Loading</p>;

  //

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

  //

  //

  return (
    <>
      <>
        {domain.isJust() && (
          <button
            className="btn-sub"
            style={{ color: 'white' }}
            onClick={showProfile}
          >
            image field
          </button>
        )}
        <Modal
          title="subdomain"
          visible={isProfileVisible}
          onOk={profileOk}
          onCancel={profileCancel}
        >
          {domain.value.id}
          <Outgoing domain={_domain} />
          <Approve
            domain={_domain}
            outgoingPendingCount={outgoingPendingCount}
            setOutgoingPendingCount={setOutgoingPendingCount}
          />
          <div>
            Outgoing Approvals:{' '}
            {outgoingApprovals ? outgoingApprovals.length : 0}
          </div>

          <div>
            {' '}
            Incoming Approvals:{' '}
            {incomingApprovals.isJust() ? incomingApprovals.value.length : 0}
          </div>
          <div>Pending Outgoing Approvals: {outgoingPendingCount}</div>
        </Modal>
        test
      </>
    </>
  );
};
export default NFTview;
