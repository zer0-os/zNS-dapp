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
import Outgoing from './outGoingApproval';

import '../components/css/profile.scss';
import { domain } from 'process';

const Profile: FC = () => {
  const context = useWeb3React<Web3Provider>();
  const [isOwnedVisible, setOwnedVisible] = useState(false);
  const [count, setCount] = useState(0);

  const contracts = useZnsContracts();
  const { owned, incomingApprovals } = useDomainStore();

  const { library, account, active, chainId } = context;

  const outgoingApprovals = owned.isJust()
    ? owned.value.filter((control) => {
        return control.approval.isJust();
      })
    : null;

  // console.log('CLAIMS', <Claim domain={_domain} />);

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
        <div className="listOut">
          <div>
            <h1>
              Outgoing Approvals:
              {outgoingApprovals ? outgoingApprovals.length : 0}{' '}
            </h1>
          </div>

          <Outgoing />
        </div>
        <div>
          <h1>
            Incoming Approvals:{' '}
            {incomingApprovals.isJust() ? incomingApprovals.value.length : 0}{' '}
          </h1>
        </div>

        <div>
          <h1>Pending Outgoing Approvals: {outgoingPendingCount} </h1>
        </div>

        <div>
          <Claim />
        </div>
      </Modal>
    </>
  );
};

export default Profile;
