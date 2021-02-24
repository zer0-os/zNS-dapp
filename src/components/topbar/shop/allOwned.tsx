import React, { FC, useCallback, useMemo, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Modal, Button } from 'antd';
import { useZnsContracts } from '../../../lib/contracts';
import {
  domainCacheContext,
  useDomainCache,
} from '../../../lib/useDomainCache';
import { domain } from 'process';

const AllOwned: FC = () => {
  const context = useWeb3React<Web3Provider>();

  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;

  const { owned } = useDomainCache();

  const allOwned = useMemo(
    () =>
      owned.isNothing()
        ? []
        : owned.value.map((control) => {
            return control.image;
          }),
    [owned, account],
  );

  if (owned.isNothing()) return null;

  return (
    <>
      <div>
        {owned.value.map((control) => {
          return <div key={control.domain}>{control.domain}</div>;
        })}
      </div>
    </>
  );
};

export default AllOwned;
