import React, { useCallback, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { getAddress } from '@ethersproject/address';
import { useZnsContracts } from '../lib/contracts';
import * as z from 'zod';
import Modal from 'antd/lib/modal/Modal';
import { zodResolver } from '../lib/validation/zodResolver';
import { useForm } from 'react-hook-form';
import { DomainContext } from '../lib/useDomainStore';
import { hexRegex } from '../lib/validation/validators';

interface TransferProps {
  domainId: string;
  domainContext: DomainContext;
}

const schema = z.object({
  address: z
    .string()
    .regex(hexRegex, 'Address must be hex')
    .refine(
      (address) => {
        try {
          return address === getAddress(address);
        } catch (e) {
          return false;
        }
      },
      {
        message: 'Not checksummed address',
      },
    ),
});

const Transfer: React.FC<TransferProps> = ({ domainId, domainContext }) => {
  const { refetchDomain, name } = domainContext;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { register, handleSubmit } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  // TODO: show user what they're doing wrong
  const [isSubdomainVisible, setSubdomainVisible] = useState(false);

  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsContracts();

  const _transfer = useCallback(
    (address: string) => {
      if (
        account &&
        contracts.isJust() &&
        name.isJust() &&
        account === name.value.owner
      )
        contracts.value.registry
          .transferFrom(account, address, name.value.id)
          .then((txr: any) => txr.wait(1))
          .then(() => {
            refetchDomain();
          });
    },
    [account, contracts, name, refetchDomain],
  );

  const showSubdomain = () => {
    setSubdomainVisible(true);
  };

  const subdomainOk = () => {
    setSubdomainVisible(false);
  };

  const subdomainCancel = () => {
    setSubdomainVisible(false);
  };

  if (name.isNothing() || name.value.owner !== account) return null;

  return (
    <>
      <button
        style={{ color: 'white' }}
        className="owned-btn"
        onClick={showSubdomain}
      >
        Transfer domain
      </button>
      <Modal
        centered
        title="subdomain"
        visible={isSubdomainVisible}
        onOk={subdomainOk}
        onCancel={subdomainCancel}
      >
        <form onSubmit={handleSubmit(({ address }) => _transfer(address))}>
          <div className="create-button">
            <button type="submit"> Transfer Domain</button>
            <input name={'address'} ref={register} placeholder="0x..." />
          </div>
        </form>
      </Modal>
    </>
  );
};

export default Transfer;
