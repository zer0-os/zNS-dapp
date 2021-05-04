import React, { useState, FC, useEffect } from 'react';

import FutureButton from '../Buttons/FutureButton/FutureButton.js';
import Enlist from '../Enlist/Enlist';
import Image from '../Image/Image';
import { Modal } from 'antd';
import { any } from 'zod';

import styles from './PreviewCard.module.css';
import { useDomainCache } from '../../lib/useDomainCache';
import _ from 'lodash';
import { Link, useLocation } from 'react-router-dom';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useDomainStore } from '../../lib/useDomainStore';

const templateNFT = 'assets/nft/redpill.png';

interface CardProps {
  props: any;
  domain: string;
  onClickLink: () => void;
}
const PreviewCard: FC<CardProps> = ({
  props,
  domain: _domain,
  onClickLink,
}) => {
  const context = useWeb3React<Web3Provider>();
  const { account } = context;
  const [enlistOpen, setEnlistOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [descript, setDescription] = useState(null);
  const [image, setImage] = useState('');
  const [meta, setData] = useState(null);
  const { useDomain, owned } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  const location = useLocation();

  const enlist = () => setEnlistOpen(true);
  const closeEnlist = () => setEnlistOpen(false);
  const preview = () => setPreviewOpen(true);
  const closePreview = () => setPreviewOpen(false);

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
  // const ipfsreq = async () => {
  //   const ipfsLib = require('ipfs-api');
  //   const ipfsClient = new ipfsLib({
  //     host: 'ipfs.infura.io',
  //     port: 5001,
  //     protocol: 'https',
  //   });
  //   if (name.isNothing()) return null;

  //   let cid = await ipfsClient.cat(name.value.metadata.slice(21));

  //   return JSON.parse(cid).descripton;
  // };

  useEffect(() => {
    // if statement for "base case" state varible if not set then set
    if (descript === null) {
      const ipfsreq = async () => {
        const ipfsLib = require('ipfs-api');
        const ipfsClient = new ipfsLib({
          host: 'ipfs.infura.io',
          port: 5001,
          protocol: 'https',
        });

        // let domain = name as any;
        if (domain.isNothing()) return;
        let cid = await ipfsClient.cat(domain.value.metadata.slice(21));

        let desc = JSON.parse(cid).description;
        let img = JSON.parse(cid).image;

        setData(cid);
        setImage(img);
        setDescription(desc);
      };
      ipfsreq();
    }
  }, [descript, domain, image, meta]);

  // const descrii = () => {
  //   let desc = ipfsreq();
  //   console.log(desc);
  // };

  if (domain.isNothing()) return null;
  return (
    <div
      className={`${styles.PreviewCard} border-primary border-rounded blur`}
      // style={props.style}
    >
      <div
        className={styles.Asset}
        onClick={preview}
        style={{ backgroundImage: `url({cid})` }}
      >
        <Image src={image} />
      </div>
      <div className={styles.Body}>
        <div>
          <h5 className={'glow-text-white'}>{domain.value.name}</h5>

          {routes.map(([key, path], i) => (
            <a key={key} className={styles.Domain} onClick={onClickLink}>
              {key}
              {i < routes.length - 1 && '.'}
            </a>
          ))}
        </div>
        <p>{descript}</p>
        <div className={styles.Members}>
          <div>
            <div
              className={styles.Dp}
              style={{ backgroundImage: `url()` }}
            ></div>
            <div className={styles.Member}>
              <a> {domain.value.owner.id}</a>
              <br />
              <span>Creator</span>
            </div>
          </div>
          <div>
            <div
              className={styles.Dp}
              style={{ backgroundImage: `url()` }}
            ></div>
            <div className={styles.Member}>
              <a>{domain.value.owner.id}</a>
              <br />
              <span>Owner</span>
            </div>
          </div>
        </div>
      </div>
      <div className={styles.Buy}>
        <FutureButton
          glow
          style={{ height: 36, width: 118, borderRadius: 30 }}
          onClick={enlist}
        >
          ENLIST
        </FutureButton>
        <span className={`glow-text-white`}>
          {' '}
          <span className={`glow-text-blue`}></span>
        </span>
        <span className={`glow-text-blue`}></span>
      </div>

      <Modal
        style={{
          position: 'relative',
          margin: 0,
          padding: 0,
        }}
        bodyStyle={{ width: 640 }}
        closeIcon={null}
        centered
        visible={enlistOpen}
        onCancel={closeEnlist}
        footer={null}
        closable={false}
      >
        <Enlist
          domain={location.pathname}
          props={{
            image: image,
            close: closeEnlist,
          }}
        />
      </Modal>

      <Modal
        centered
        visible={previewOpen}
        onCancel={closePreview}
        closable={false}
        footer={null}
        style={{ maxWidth: '600px !important', maxHeight: '600px !important' }}
      >
        <Image src={image} />
      </Modal>
    </div>
  );
};

export default PreviewCard;
