import React, { useState, FC } from 'react';

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


import StaticEmulator from '../../lib/StaticEmulator/StaticEmulator.js'

const wildToUsd = 0.5; // Just a template for now

interface EnlistProps {
  name: string;
  props: any;
}

const Enlist: FC<EnlistProps> = ({ props, name: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const { active, connector, error } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { name } = domainContext;

  console.log(name)
  console.log(props)

  // State
  const [ emailAddress, setEmailAddress ] = useState('')
  const [ reasonForPurchase, setReasonForPurchase ] = useState('')
  const [ bidUsd, setBidUsd ] = useState(0)

  // Form validation
  const isEmail = (text: string) => /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(String(text).toLowerCase())
  const valid = isEmail(emailAddress) && reasonForPurchase.length > 0 && bidUsd > 0

  const submit = () => {
    // Got all the form data here
  }


  if (name.isNothing()) return null;
  return (
    <div
      className={`${styles.Enlist} blur border-rounded border-primary`}
    >
      <div className={styles.Header}>
        <h1 className={`glow-text-white`}>Enlist To Purchase</h1>
        <div>
          <h2 className={`glow-text-white`}>0://{ name.value.name }</h2>
          {/* <span>By Frank Wilder</span> */}
        </div>
      </div>
      <hr className='glow-line' />

      <form className={styles.Section}>
        <div style={{ display: 'flex' }}>
          <div className={styles.Inputs}>
            <TextInput
              placeholder={'Email Address'}
              style={{height: 48}}
              onChange={(text: string) => setEmailAddress(text)}
            />
            <TextInput
              placeholder={'Reason for purchase'}
              multiline
              style={{height: 79}}
              onChange={(text: string) => setReasonForPurchase(text)}
            />
            <TextInput
              type='number'
              placeholder={'Bid (USD)'}
              style={{height: 48}}
              onChange={(text: string) => setBidUsd(text == '' ? 0 : parseFloat(text))}
            />
            <span className={styles.Bid}>{Number((bidUsd * wildToUsd).toFixed(2)).toLocaleString()} WILD</span>
          </div>
          <div
            className={`${styles.NFT} border-rounded`}
            // Template NFT for now
            style={{ backgroundImage: `url(${props.image})` }}
          ></div>
        </div>
      </form>
      <FutureButton
        glow={ valid }
        style={{ height: 36, borderRadius: 18, textTransform: 'uppercase', margin: '47px auto 0 auto' }}
        onClick={submit}
      >
        Submit
      </FutureButton>
    </div>
  );
};

export default Enlist;
