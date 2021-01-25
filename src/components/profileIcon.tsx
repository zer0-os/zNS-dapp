import React, { FC, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useZnsContracts } from '../lib/contracts';
import { useDomainCache } from '../lib/useDomainCache';
import { Modal, Button } from 'antd';

interface ProfileProps {
  domain: string;
}

const Profile: FC<ProfileProps> = ({ domain: _domain }) => {
  const [isSubdomainVisible, setSubdomainVisible] = useState(false);
  const context = useWeb3React<Web3Provider>();
  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  if (domain.isNothing()) return <p>Loading</p>;

  const showSubdomain = () => {
    setSubdomainVisible(true);
  };

  const subdomainOk = () => {
    setSubdomainVisible(false);
  };

  const subdomainCancel = () => {
    setSubdomainVisible(false);
  };

  return (
    <>
      {account?.toLowerCase() === domain.value.owner.toLowerCase() ? (
        <>
          <button
            className="btn-sub"
            style={{ color: 'white' }}
            onClick={showSubdomain}
          >
            image field
          </button>

          <Modal
            title="subdomain"
            visible={isSubdomainVisible}
            onOk={subdomainOk}
            onCancel={subdomainCancel}
          >
            {domain.value.children}
          </Modal>
        </>
      ) : null}
    </>
  );
};
export default Profile;
