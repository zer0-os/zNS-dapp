import React, { useCallback, useEffect, useState, useRef } from 'react';
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
  const { refetchDomain, domain } = domainContext;
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const contracts = useZnsBasicContracts();
  const contract = useZnsContracts();
  const [nftName, setName] = useState('');
  const [nftStory, setStory] = useState('');
  const [nftDomain, setNftDomain] = useState('');
  const [fieldErrors, setFieldErrors] = useState<string[]>([]);
  const [uploadedImage, setUploadedImage] = useState<
    string | ArrayBuffer | null
  >(null);
  const [imageFile, setImageFile] = useState<Buffer>(Buffer.from(''));
  const [progress, setProgress] = useState(0);
  const { onMint, onCancel } = props;
  const location = useLocation();
  const { register, handleSubmit, errors, setValue } = useForm<
    z.infer<typeof schema>
  >({
    resolver: zodResolver(schema),
  });

  // Handling the upload dialog
  const inputFile = useRef<HTMLInputElement>(null);
  const openUploadDialog = () => {
    if (inputFile.current) inputFile.current.click();
  };

  // const ipfs = new IPFS({
  //   host: 'ipfs.infura.io',
  //   port: 5001,
  //   protocol: 'https',
  // });

  // const uploadImage = async () => {
  //   ipfs.add()
  // }

  // ipfs.add(nftStory).then(console.log).catch(console.log);

  const uploadStory = () => {};

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

  const ipfsLib = require('ipfs-api');
  const ipfsClient = new ipfsLib({
    host: 'ipfs.infura.io',
    port: 5001,
    protocol: 'https',
  });

  const onSubmit = async () => {
    const ipfsRoot = `https://ipfs.io/ipfs/`;

    let res = await ipfsClient.add(imageFile);
    const imagePath = `${ipfsRoot}${res[0].hash}`;

    const metadataObject = {
      title: nftName,
      description: nftStory,
      image: imagePath,
    };

    const metadataJson = JSON.stringify(metadataObject);
    res = await ipfsClient.add(Buffer.from(metadataJson));
    const metadataPath = `${ipfsRoot}${res[0].hash}`;
    console.log(`Metadata is at ${metadataPath}`);

    _create(nftName, metadataPath);
  };

  const onImageChanged = (event: any) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      let reader = new FileReader();
      reader.onload = (e) => {
        if (!e.target) {
          console.error('no target');
          return;
        }
        setUploadedImage(e.target?.result);
      };
      reader.readAsDataURL(file);

      const bufferReader = new FileReader();
      bufferReader.readAsArrayBuffer(file);
      bufferReader.onloadend = () => {
        setImageFile(Buffer.from(bufferReader.result as ArrayBuffer));
      };
    }
  };

  const cancel = () => {
    onCancel();
  };

  const goTo = (x: number) => {
    const e = [];
    if (!nftName.length) e.push('name');
    if (!nftStory.length) e.push('story');
    if (!nftDomain.length) e.push('domain');
    if (!uploadedImage) e.push('image');

    if (e.length) return setFieldErrors(e);

    console.log('no errors', e);

    setFieldErrors([]);
    setProgress(x);
  };

  const _create = useCallback(
    (label: string, metadataUri: string) => {
      if (account && contracts.isJust() && domain.isJust()) {
        contracts.value.basic
          .registerSubdomainExtended(
            domain.value.id,
            label,
            account,
            metadataUri,
            0, // royalty amount
            true, // locked by default
          )
          .then((txr: any) => {
            txr.wait(1);
          })
          .catch((err) =>
            console.error(
              'Oh well, you failed. Here some thoughts on the error that occurred:',
              err,
            ),
          )
          .then(() => {
            refetchDomain();
          });
      }
    },
    [account, contracts, domain, refetchDomain],
  );

  if (domain.isNothing() || account !== account) return null;

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
              error={fieldErrors.includes('name')}
            />
            <TextInput
              onChange={(text: string) => {
                setNftDomain(text);
              }}
              placeholder="Domain"
              error={fieldErrors.includes('domain')}
            />
            <TextInput
              onChange={(text: string) => {
                setStory(text);
              }}
              multiline={true}
              placeholder={'Story'}
              style={{ height: 146, marginTop: 24 }}
              error={fieldErrors.includes('story')}
            />
          </div>
          <div>
            <div
              onClick={openUploadDialog}
              className={`${MintNewNFTStyle.NFT} border-rounded ${
                fieldErrors.includes('image') ? 'error' : ''
              }`}
              style={{
                transition:
                  'border-color var(--animation-time-medium) ease-in-out',
              }}
            >
              {!uploadedImage && (
                <span className="glow-text-white">Choose an Image</span>
              )}
              <img
                src={uploadedImage as string}
                onChange={onImageChanged}
                style={{ display: uploadedImage ? 'inline-block' : 'none' }}
              />
            </div>
            <input
              style={{
                display: 'none',
              }}
              accept="image/*"
              multiple={false}
              name={'image'}
              type="file"
              onChange={onImageChanged}
              ref={inputFile}
            ></input>
          </div>
        </div>
      </form>
      <FutureButton
        glow={nftName.length && nftStory.length}
        style={{ height: 36, borderRadius: 18, margin: '47px auto 0 auto' }}
        onClick={async () => {
          goTo(1);
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
          onClick={onSubmit}
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
