import React, { useCallback, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useZnsContracts } from '../../lib/contracts';
import * as z from 'zod';
import { zodResolver } from '../../lib/validation/zodResolver';
import { useForm } from 'react-hook-form';
import { DomainContext } from '../../lib/useDomainStore';
import { subdomainRegex } from '../../lib/validation/validators';
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
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isSubdomainVisible, setSubdomainVisible] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [imageUrl, setImageUrl] = useState('ipfs://Qmimage');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { register, handleSubmit, errors } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  // TODO: show user what they're doing wrong
  // useEffect(() => console.log(errors), [errors]);
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsContracts();

  const _create = useCallback(
    (child: string) => {
      if (account && contracts.isJust() && domain.isJust())
        contracts.value.registry
          .createDomain(
            domain.value.name === 'ROOT'
              ? child
              : domain.value.name + '.' + child,
            account,
            account,
            'ipfs://Qmresolver',
            imageUrl,
          )
          .then((txr: any) => txr.wait(1))
          .then(() => {
            refetchDomain();
          });
    },
    [account, contracts, domain, imageUrl, refetchDomain],
  );

  if (domain.isNothing() || domain.value.owner !== account) return null;

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const showSubdomain = () => {
    setSubdomainVisible(true);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const subdomainOk = () => {
    setSubdomainVisible(false);
  };

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const subdomainCancel = () => {
    setSubdomainVisible(false);
  };

  return (
    <>
      {/* <button
        style={{ color: 'white' }}
        className="owned-btn"
        onClick={showSubdomain}
      >
        Create domain
      </button> */}
      {/* <Modal
        title="subdomain"
        visible={isSubdomainVisible}
        onOk={subdomainOk}
        onCancel={subdomainCancel}
        footer={null}
      > */}

      <div className="create-button">
        <button
          type="submit"
          onSubmit={handleSubmit(({ child }) => _create(child))}
        >
          {' '}
          Mint NFT
        </button>
        <input name={'child'} ref={register} placeholder="Domain" />
      </div>

      {/* </Modal> */}
    </>
  );
};

export default Create;
