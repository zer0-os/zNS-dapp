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
import ipfsClient from 'ipfs-http-client';
import assert from 'assert';

interface CreateProps {
  domainId: string;
  domainContext: DomainContext;
  props: any;
}

const schema = z.object({
  image: z.any().transform(z.any(), (file: FileList) => file[0]),
  name: z.string(),
  story: z.string(),
});

const Create: React.FC<CreateProps> = ({ domainId, domainContext, props }) => {
  const { refetchDomain, name } = domainContext;
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsBasicContracts();
  const contract = useZnsContracts();
  const [nftName, setName] = useState('');
  const [nftStory, setStory] = useState('');
  const [uploadedImage, setImage] = useState<string | ArrayBuffer | null>(null);
  const [progress, setProgress] = useState(0);
  const { onMint, onCancel } = props;
  const location = useLocation();
  const { register, handleSubmit, errors, setValue } = useForm<
    z.infer<typeof schema>
  >({
    resolver: zodResolver(schema),
  });

  const IPFS = require('ipfs-mini');
  const ipfs = new IPFS({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
  });

  // const uploadImage = async () => {
  //   ipfs.add()
  // }

  // ipfs.add(nftStory).then(console.log).catch(console.log);

  const uploadAndSetImage = useCallback(
    async (file: File) => {
      assert(name.isJust());
      return ipfs.upload(setImage, file);
    },
    [name, setImage],
  );

  const uploadStory = () => {};
  // const metaData = {
  //   description: '',
  // };

  // upload data to ipf
  // const cid = ipfs.add(metaData);
  // const data = JSON.stringify(metaData);
  // fs.writeFile('./metadata.json', data, (err: any) => {
  //   if (err) {
  //     console.log('Error writing file', err);
  //   } else {
  //     console.log('writing file success');
  //   }
  // });
  // ipfs.add(data).then(console.log).catch(console.log);

  // ZNA-Routes
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

  const onSubmit = () => {
    console.log('submit');
  };

  const onImageChanged = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      let reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target) {
          console.error('no target');
          return;
        }
        setImage(e.target?.result);
      };
      reader.readAsDataURL(event.target.files[0]);
    }
  };

  // //  Form Submit Handlers
  const submit = () => {
    _create(nftName);
    // Skipping the actual create for now
    // onMint();
  };
  const cancel = () => {
    onCancel();
  };

  const goTo = (x: number) =>
    nftName.length && setStory.length ? setProgress(x) : setProgress(0);

  const _create = useCallback(
    (child: string) => {
      // if (account && contracts.isJust() && name.isJust()) {
      //   contracts.value.basic
      //     .registerSubdomainExtended(
      //       name.value.id,
      //       child,
      //       account,
      //       Image,
      //       account,
      //       name.value.isLocked,
      //     )
      //     .then((txr: any) => {
      //       txr.wait(1);
      //     })
      //     .catch((err) =>
      //       console.error(
      //         'Oh well, you failed. Here some thoughts on the error that occurred:',
      //         err,
      //       ),
      //     )
      //     .then(() => {
      //       refetchDomain();
      //     });
      // }
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
              onChange={(text: string) => {
                setName(text);
              }}
              placeholder="Name"
            />
            <TextInput
              onChange={(text: string) => {
                setStory(text);
              }}
              multiline={true}
              placeholder={'Story'}
              style={{ height: 146, marginTop: 24, marginLeft: 200 }}
            />
          </div>
          <div>
            <img
              className={`${MintNewNFTStyle.NFT} border-rounded`}
              src={uploadedImage as string}
              onChange={onImageChanged}
            />
            <input
              style={{
                height: 36,

                margin: '47px auto 0 auto',
              }}
              accept="image/*"
              multiple={false}
              name={'image'}
              type="file"
              onChange={onImageChanged}
            ></input>
          </div>
        </div>
      </form>
      <FutureButton
        glow={nftName.length && nftStory.length}
        style={{ height: 36, borderRadius: 18, margin: '47px auto 0 auto' }}
        onClick={async () => {
          console.log('press');
          onSubmit();
          //goTo(1)
        }}
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
