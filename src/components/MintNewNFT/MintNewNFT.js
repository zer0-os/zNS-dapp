import React, { useState } from 'react';

import StepBar from '../StepBar/StepBar.js';
import ToggleSection from '../ToggleSection/ToggleSection.js';
import TextInput from '../TextInput/TextInput.js';
import FutureButton from '../Buttons/FutureButton/FutureButton.js';

import MintNewNFTStyle from './MintNewNFT.module.css';

const MintNewNFT = (props) => {
  return (
    <div
      className={`${MintNewNFTStyle.MintNewNFT} blur border-rounded border-primary`}
    >
      <div className={MintNewNFTStyle.Header}>
        <h1 className={`glow-text-white`}>Mint A New NFT</h1>
        <div>
          <h2 className={`glow-text-white`}>0:/Wilder.NewNFT</h2>
          <span>By Frank Wilder</span>
        </div>
      </div>
        <form className={MintNewNFTStyle.Section}>
          <div style={{ display: 'flex' }}>
            <div className={MintNewNFTStyle.Inputs}>
              <TextInput placeholder={'NFT Name'} />
              <TextInput
                multiline={true}
                placeholder={'Story'}
                style={{ height: 146, marginTop: 24 }}
              />
            </div>
            <div
              className={`${MintNewNFTStyle.NFT} border-rounded`}
              // Template background for now
              style={{ backgroundImage: `url(assets/nft/redpill.png)` }}
            ></div>
          </div>
        </form>
        <FutureButton
          style={{ margin: '47px auto 0 auto' }}
        >
          Continue
        </FutureButton>
      {/* <ToggleSection 
				open={step === 2}
				style={{marginTop: 51}}
				label={'Token Dynamics'}
			>
			</ToggleSection>
			<ToggleSection 
				open={step === 3}
				style={{marginTop: 51}}
				label={'Staking'}
			>
			</ToggleSection> */}
    </div>
  );
};

export default MintNewNFT;
