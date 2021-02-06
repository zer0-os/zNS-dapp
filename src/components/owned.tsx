import React, { FC, useCallback, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { BrowserRouter as Router, Switch, Route, Link } from 'react-router-dom';
import { Modal, Button } from 'antd';
import { useZnsContracts } from '../lib/contracts';
import { domainCacheContext, useDomainCache } from '../lib/useDomainCache';

const Owned: FC = () => {
  const context = useWeb3React<Web3Provider>();

  const contracts = useZnsContracts();
  const { library, account, active, chainId } = context;
  const { owned } = useDomainCache();

  if (owned.isNothing()) return <p>User owns no domains.</p>;

  return (
    <>
      <div>
        {console.log('OWNED ', owned)}
        {owned.value.map((control) => {
          return (
            <div key={control.domain}>
              <Link
                to={'/' + control.domain}
                //   key={control.domain}
              >
                {control.domain}
              </Link>
            </div>
          );
        })}
      </div>
    </>
  );
};

export default Owned;
