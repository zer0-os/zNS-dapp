import React, { useState, FC } from 'react';

import StepBar from '../StepBar/StepBar.js';
import ToggleSection from '../ToggleSection/ToggleSection.js';
import TextInput from '../TextInput/TextInput.js';
import FutureButton from '../Buttons/FutureButton/FutureButton.js';

import MintNewNFTStyle from './MintNewNFT.module.css';

// new
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useDomainCache } from '../../lib/useDomainCache';
import Create from '../topbar/topbar/create';

interface MintProps {
  name: string;
  props: any;
}

const MintNewNFT: FC<MintProps> = ({ props, name: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const { active, connector, error } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { name } = domainContext;

  if (name.isNothing()) return null;
  return (
      <Create
        props={props}
        domainId={name.value.id}
        domainContext={domainContext}
      />
  );
};

export default MintNewNFT;
