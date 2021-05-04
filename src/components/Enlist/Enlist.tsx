import React, { useState, FC, useEffect } from 'react';

import StepBar from '../StepBar/StepBar.js';
import ToggleSection from '../ToggleSection/ToggleSection.js';
import TextInput from '../TextInput/TextInput.js';
import FutureButton from '../Buttons/FutureButton/FutureButton.js';

import styles from './Enlist.module.css';

// new
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useDomainCache } from '../../lib/useDomainCache';
import Create from '../topbar/topbar/create';

import StaticEmulator from '../../lib/StaticEmulator/StaticEmulator.js';
import emailjs from 'emailjs-com';

const wildToUsd = 0.5; // Just a template for now

interface EnlistProps {
  domain: string;
  props: any;
}

const Enlist: FC<EnlistProps> = ({ props, domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const { active, connector, error } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;

  // State
  const [emailAddress, setEmailAddress] = useState('');
  const [reasonForPurchase, setReasonForPurchase] = useState('');
  const [bidUsd, setBidUsd] = useState(0);
  const [descript, setDescription] = useState(null);
  const [image, setImage] = useState('');

  // Form validation
  const isEmail = (text: string) =>
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      String(text).toLowerCase(),
    );
  const valid =
    isEmail(emailAddress) && reasonForPurchase.length > 0 && bidUsd > 0;

  const submit = () => {
    // Got all the form data here
  };

  function sendEmail(e: any) {
    // emailjs.init(process.env.REACT_APP_EMAIL);
    emailjs
      .send('service_ht5ak0n', 'template_t5hifjr', {
        emailAddress,
        reasonForPurchase,
      })
      .then(
        (result) => {
          console.log(result.text);
        },
        (error) => {
          console.log(error.text);
        },
      );

    props.props.close();
    // document.getElementById('enlistForm').reset();
  }

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

        setImage(img);
      };
      ipfsreq();
    }
  }, [descript, domain, image]);

  if (domain.isNothing()) return null;
  return (
    <div className={`${styles.Enlist} blur border-rounded border-primary`}>
      <div className={styles.Header}>
        <h1 className={`glow-text-white`}> enlist To Purchase</h1>
        <div>
          <h2 className={`glow-text-white`}>0://{domain.value.name}</h2>
          {/* <span>By Frank Wilder</span> */}
        </div>
      </div>
      <hr className="glow-line" />

      <form id="enlistForm" className={styles.Section}>
        <div style={{ display: 'flex' }}>
          <div className={styles.Inputs}>
            <TextInput
              placeholder={'Email Address'}
              style={{ height: 48 }}
              onChange={(text: string) => setEmailAddress(text)}
            />
            <TextInput
              placeholder={'Reason for purchase'}
              multiline
              style={{ height: 79 }}
              onChange={(text: string) => setReasonForPurchase(text)}
            />
          </div>
          <div
            className={`${styles.NFT} border-rounded`}
            // Template NFT for now
            style={{ backgroundImage: `url(${props.image})` }}
          >
            {' '}
            <img src={image} />
          </div>
        </div>
      </form>
      <FutureButton
        glow={valid}
        style={{
          height: 36,
          borderRadius: 18,
          textTransform: 'uppercase',
          margin: '47px auto 0 auto',
        }}
        onClick={sendEmail}
      >
        Submit
      </FutureButton>
    </div>
  );
};

export default Enlist;
