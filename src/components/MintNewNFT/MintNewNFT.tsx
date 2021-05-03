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
  domain: string;
  props: any;
}

const MintNewNFT: FC<MintProps> = ({ props, domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  const { active, connector, error } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;

  if (domain.isNothing()) return null;
  return (
    <Create
      props={props}
      domainId={domain.value.id}
      domainContext={domainContext}
    />
  );
};

export default MintNewNFT;
