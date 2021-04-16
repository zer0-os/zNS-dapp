import React, { useCallback, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useZnsContracts } from '../../../lib/contracts';
import * as z from 'zod';
import { zodResolver } from '../../../lib/validation/zodResolver';
import { useForm } from 'react-hook-form';
import { subdomainRegex } from '../../../lib/validation/validators';
import { DomainContext } from '../../../lib/useDomainStore';
import { Modal, Button, Input } from 'antd';
import styles from '../../TextInput/TextInput.module.css';

import MintNewNFTStyle from '../../MintNewNFT/MintNewNFT.module.css';
import FutureButton from '../../Buttons/FutureButton/FutureButton.js';
import TextInput from '../../TextInput/TextInput.js';
import { ethers } from 'ethers';

interface CreateProps {
  domainId: string;
  domainContext: DomainContext;
  props: any;
}

const schema = z.object({
  child: z
    .string()
    .regex(subdomainRegex, 'Subdomain must only contain alphanumeric letters'),
});

const Create: React.FC<CreateProps> = ({ domainId, domainContext, props }) => {
  const { refetchDomain, name } = domainContext;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [isSubdomainVisible, setSubdomainVisible] = useState(false);
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [imageUrl, setImageUrl] = useState('ipfs://Qmimage');
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { register, handleSubmit, errors } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });
  // TODO: show user what they're doing wrong
  useEffect(() => console.log(errors), [errors]);
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsContracts();

  // Name field stored in state
  const [nftName, setName] = useState('');
  const submit = () => {
    // Click handler for continue button
    _create(nftName);
  };

  const _create = useCallback(
    (child: string) => {
      console.log(child);
      // Didn't want to call any of the query stuff so just chucked a return here
      if (account && contracts.isJust() && name.isJust()) {
        console.log('if statement');
        contracts.value.registry
          .registerDomain(
            name.value.name === '' ? child : name.value.name + '.' + child,
            '0X0',
            account,
            account,
          )
          .then((txr: any) => {
            console.log('contract call');
            txr.wait(1);
          })
          .then(() => {
            console.log('refetch domain');
            refetchDomain();
          });
      }
    },
    [account, contracts, name, refetchDomain],
  );

  if (name.isNothing() || account !== account) return null;
  console.log(name.value.name + 'name');
  return (
    <>
      <form className={MintNewNFTStyle.Section}>
        <div style={{ display: 'flex' }}>
          <div className={MintNewNFTStyle.Inputs}>
            <TextInput
              onChange={(text: string) => setName(text)}
              placeholder="Name"
            />
          </div>
          <div
            className={`${MintNewNFTStyle.NFT} border-rounded`}
            style={{ backgroundImage: `url(assets/nft/redpill.png)` }}
          ></div>
        </div>
      </form>

      <FutureButton
        glow
        style={{ margin: '47px auto 0 auto' }}
        onClick={submit}
      >
        Continue
      </FutureButton>
    </>
  );
};

export default Create;
