import React, { useCallback, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useZnsContracts } from '../../lib/contracts';
import * as z from 'zod';
import { zodResolver } from '../../lib/validation/zodResolver';
import { useForm } from 'react-hook-form';
import { DomainContext } from '../../lib/useDomainStore';
import { subdomainRegex } from '../../lib/validation/validators';
import Modal from 'antd/lib/modal/Modal';
// import { Modal, Button } from 'antd';

interface CreateProps {
  domainId: string;
  domainContext: DomainContext;
}

const schema = z.object({
  child: z
    .string()
    .regex(subdomainRegex, 'Subdomain must only contain alphanumeric letters'),
});

const Create: React.FC<CreateProps> = ({ domainId, domainContext }) => {
  const { refetchDomain, domain } = domainContext;
  const [isSubdomainVisible, setSubdomainVisible] = useState(false);
  const [imageUrl, setImageUrl] = useState('ipfs://Qmimage');
  const { register, handleSubmit, errors } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  // TODO: show user what they're doing wrong
  useEffect(() => console.log(errors), [errors]);
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsContracts();

  const _create = useCallback(
    (child: string) => {
      if (account && contracts.isJust() && domain.isJust())
        contracts.value.registry
          .createDomain(
            domain.value.domain === 'ROOT'
              ? child
              : domain.value.domain + '.' + child,
            account,
            account,
            'ipfs://Qmresolver',
            imageUrl,
          )
          .then((txr) => txr.wait(1))
          .then(() => {
            refetchDomain();
          });
    },
    [contracts, account],
  );

  if (domain.isNothing() || domain.value.owner !== account) return null;

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
      <button
        style={{ color: 'white' }}
        className="owned-btn"
        onClick={showSubdomain}
      >
        Create domain
      </button>
      <Modal
        title="subdomain"
        visible={isSubdomainVisible}
        onOk={subdomainOk}
        onCancel={subdomainCancel}
      >
        <form onSubmit={handleSubmit(({ child }) => _create(child))}>
          <div className="create-button">
            <button type="submit"> Create Domain</button>
            <input name={'child'} ref={register} placeholder="child domain" />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Create;
