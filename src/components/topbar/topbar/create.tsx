import React, { useCallback, useEffect, useState } from 'react';
import { useWeb3React } from '@web3-react/core';
import { Web3Provider } from '@ethersproject/providers';
import { useZnsBasicContracts } from '../../../lib/basicContract';
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
import { Link, useLocation } from 'react-router-dom';
import _ from 'lodash';
import ipfs_metadata from '../../../lib/metadata';
import assert from 'assert';

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
  const location = useLocation();
  const routes = _.transform(
    location.pathname
      .substr(1)
      .split('.')
      .filter((s) => s !== ''),
    (acc: [string, string][], val, i) => {
      let next = 0 < i ? acc[i - 1][1] + '.' + val : val;
      acc.push([val, next]);
    },
  );
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [isSubdomainVisible, setSubdomainVisible] = useState(false);
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const [imageUrl, setImageUrl] = useState('ipfs://Qmimage');
  // // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { register, handleSubmit, errors } = useForm<z.infer<typeof schema>>({
    resolver: zodResolver(schema),
  });

  // TODO: show user what they're doing wrong
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsBasicContracts();
  const contract = useZnsContracts();

  const [nftName, setName] = useState('');
  const [nftStory, setStory] = useState('');
  const [progress, setProgress] = useState(0);

  const { onMint, onCancel } = props;

  const submit = () => {
    _create(nftName);
    // Skipping the actual create for now
    // onMint();
  };

  const cancel = () => {
    onCancel();
  };

  const goTo = (x: number) =>
    nftName.length ? setProgress(x) : setProgress(0);


  const _metaData = useCallback(
    (image: string) => {
      if (account && contract.isJust() && name.isJust())
      contract.value.registry
        .setDomainMetadataUri(name.value.id, image)
        .then((txr: any) => txr.wait(1))
        .then(() => {
          refetchDomain();
  );

  const upload = useCallback(
    async (file: string) => {
      assert(name.isJust());
      return ipfs_metadata
        .upload(name.value.metadata, file)
        .then(async (added: any) => _metaData('ipfs://' + added.hash))
        .then(() => refetchDomain());
    },
    [_metaData, name, refetchDomain],
  );

  const _create = useCallback(
    (child: string) => {
      if (account && contracts.isJust() && name.isJust()) {
        contracts.value.basic
          .registerSubdomainExtended(
            name.value.id,
            child,
            account,
            _metaData,
            metedate,
            name.value.name,
          )
          .then((txr: any) => {
            console.log('contract call');
            txr.wait(1);
          })
          .catch((err) =>
            console.error(
              'Oh well, you failed. Here some thoughts on the error that occured:',
              err,
            ),
          )
          .then(() => {
            console.log('refetch domain');
            refetchDomain();
          });
      }
    },
    [account, contracts, name, refetchDomain],
  );

  if (name.isNothing() || account !== account) return null;
  console.log(name.value.name + 'id data');
  const details = () => (
    <div
      className={`${MintNewNFTStyle.MintNewNFT} blur border-rounded border-primary`}
    >
      <div className={MintNewNFTStyle.Header}>
        <h1 className={`glow-text-white`}>Mint A New NFT</h1>
        <div>
          <h2 className={`glow-text-white`}>
            {routes.length > 0 ? (
              // <div className="routeBox">
              <div className="route">
                {routes.map(([key, path], i) => (
                  <Link key={key} className="route-nav-text-sub" to={path}>
                    {key}
                    {i < routes.length - 1 && '.'}
                  </Link>
                ))}
              </div>
            ) : null}
          </h2>
        </div>
      </div>
      <form className={MintNewNFTStyle.Section}>
        <div style={{ display: 'flex' }}>
          <div className={MintNewNFTStyle.Inputs}>
            <TextInput
              onChange={(text: string) => setName(text)}
              placeholder="Name"
            />
            {/* <TextInput
              onChange={(text: string) => setStory(text)}
              multiline={true}
              placeholder={'Story'}
              style={{ height: 146, marginTop: 24 }}
            /> */}
          </div>
          <div
            className={`${MintNewNFTStyle.NFT} border-rounded`}
            style={{ backgroundImage: `url(assets/nft/redpill.png)` }}
          ></div>
        </div>
      </form>
      <FutureButton
        glow={nftName.length && nftStory.length}
        style={{ height: 36, borderRadius: 18, margin: '47px auto 0 auto' }}
        onClick={() => goTo(1)}
      >
        Continue
      </FutureButton>
    </div>
  );

  const confirmation = () => (
    <div
      className={`${MintNewNFTStyle.MintNewNFT} blur border-rounded border-primary`}
    >
      <div className={MintNewNFTStyle.Header}>
        <h1 className={`glow-text-white`}>Are You Sure?</h1>
      </div>
      <hr style={{ marginTop: 34 }} className="glow-line" />
      <p className={MintNewNFTStyle.Warning}>
        This transaction is about to be seared upon the Blockchain. There’s no
        going back.
      </p>
      <div className={MintNewNFTStyle.Buttons}>
        <FutureButton
          glow
          style={{ height: 36, borderRadius: 18 }}
          onClick={() => goTo(0)}
        >
          Back
        </FutureButton>
        <FutureButton
          glow
          style={{ height: 36, borderRadius: 18 }}
          onClick={submit}
        >
          Confirm
        </FutureButton>
      </div>
    </div>
  );

  return (
    <>
      {progress === 0 && details()}
      {progress === 1 && confirmation()}
    </>
  );
};

export default Create;
