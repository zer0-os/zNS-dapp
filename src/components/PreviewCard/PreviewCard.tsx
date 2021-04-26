import React, { useState, FC } from 'react';

import FutureButton from '../Buttons/FutureButton/FutureButton.js';
import Enlist from '../Enlist/Enlist';
import { Modal } from 'antd';
import { any } from 'zod';

import styles from './PreviewCard.module.css';
import { useDomainCache } from '../../lib/useDomainCache';
import _ from 'lodash';
import { Link, useLocation } from 'react-router-dom';

const templateNFT = 'assets/nft/redpill.png';

interface CardProps {
  props: any;
  name: string;
}
const PreviewCard: FC<CardProps> = ({ props, name: _domain }) => {
  const [enlistOpen, setEnlistOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [descript, setDescription] = useState('');
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { name } = domainContext;
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
  const ipfsreq = async (cid: string) => {
    const ipfsLib = require('ipfs-api');
    const ipfsClient = new ipfsLib({
      host: 'ipfs.infura.io',
      port: 5001,
      protocol: 'https',
    });
    if (name.isNothing()) return null;

    cid = await ipfsClient.cat(name.value.metadata.slice(21));
    let desc = JSON.stringify(cid);
    let data = JSON.parse(desc).description;
    return data;
  };
  // const descrii = () => {
  //   let desc = ipfsreq();
  //   console.log(desc);
  // };

  let desc = ipfsreq('cid');

  if (name.isNothing()) return null;
  return (
    <div
      className={`${styles.PreviewCard} border-primary border-rounded blur`}
      // style={props.style}
    >
      <div
        className={styles.Asset}
        onClick={preview}
        style={{ backgroundImage: `url({cid})` }}
      ></div>
      <div className={styles.Body}>
        <div>
          <h5 className={'glow-text-white'}>{name.value.name}</h5>

          {routes.map(([key, path], i) => (
            <a key={key} className={styles.Domain}>
              <Link className="route-nav-text-sub" to={path}>
                {key}
                {i < routes.length - 1 && '.'}
              </Link>
            </a>
          ))}
        </div>
        <p>desc</p>
        <div className={styles.Members}>
          <div>
            <div
              className={styles.Dp}
              style={{ backgroundImage: `url({cid})` }}
            ></div>
            <div className={styles.Member}>
              <span>ttt</span>
              <br />
              <span>Creator</span>
            </div>
          </div>
          <div>
            <div
              className={styles.Dp}
              // style={{ backgroundImage: `url(${props.owner.img})` }}
            ></div>
            <div className={styles.Member}>
              {/* <span>{props.owner.domain}</span> */}
              <div>div</div>
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
        <Enlist name={name.value.name} props={{ close: closeEnlist }} />
      </Modal>

      <Modal
        centered
        visible={previewOpen}
        onCancel={closePreview}
        closable={false}
        footer={null}
        style={{ width: 500 }}
      >
        <img src={name.value.metadata} />
      </Modal>
    </div>
  );
};

export default PreviewCard;
