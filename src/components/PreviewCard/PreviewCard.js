import React, { useState } from 'react';

import FutureButton from '../Buttons/FutureButton/FutureButton.js';
import Enlist from '../Enlist/Enlist';
import { Modal } from 'antd';
import { any } from 'zod';

import styles from './PreviewCard.module.css';

const templateNFT = 'assets/nft/redpill.png';

const PreviewCard = (props) => {
  const [enlistOpen, setEnlistOpen] = useState(false);
  const [previewOpen, setPreviewOpen] = useState(false);

  const enlist = () => setEnlistOpen(true);
  const closeEnlist = () => setEnlistOpen(false);
  const preview = () => setPreviewOpen(true);
  const closePreview = () => setPreviewOpen(false);

  return (
    <div
      className={`${styles.PreviewCard} border-primary border-rounded blur`}
      style={props.style}
    >
      <div
        className={styles.Asset}
        onClick={preview}
        style={{ backgroundImage: `url(${props.img})` }}
      ></div>
      <div className={styles.Body}>
        <div>
          <h5 className={'glow-text-white'}>{props.name}</h5>
          <a className={styles.Domain}>{props.domain}</a>
        </div>
        <p>{props.description}</p>
        <div className={styles.Members}>
          <div>
            <div
              className={styles.Dp}
              style={{ backgroundImage: `url(${props.creator.img})` }}
            ></div>
            <div className={styles.Member}>
              <a>{props.creator.domain}</a>
              <br />
              <span>Creator</span>
            </div>
          </div>
          <div>
            <div
              className={styles.Dp}
              style={{ backgroundImage: `url(${props.owner.img})` }}
            ></div>
            <div className={styles.Member}>
              <a>{props.owner.domain}</a>
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
        <Enlist name={props.name} props={{ image: props.img, close: closeEnlist}} />
      </Modal>

      <Modal
        centered
        visible={previewOpen}
        onCancel={closePreview}
        closable={false}
        footer={null}
      >
        <img src={props.img} />
      </Modal>
    </div>
  );
};

export default PreviewCard;
