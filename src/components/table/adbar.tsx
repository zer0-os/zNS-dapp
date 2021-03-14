import { FC, useState, useEffect } from 'react';
import _ from 'lodash';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Link, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useZnsContracts } from '../../lib/contracts';
import { useDomainCache } from '../../lib/useDomainCache';
import '../css/adbar.scss';
import adbg from '../css/img/adbg.png';
import wilderavatar from '../css/img/wilderavatar.png';

interface AdBarProps {
  domain: string;
}

const AdBar: FC<AdBarProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();

  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const contracts = useZnsContracts();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { account } = context;
  const { useDomain, useAllDomains } = useDomainCache();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { _allDomains, refetchAllDomains } = useAllDomains(_domain);
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const history = useHistory();

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

  if (domain.isNothing()) return null;
  return (
    <div className="adbarContainer">
      <img className="adbg" src={adbg} alt="" />
      <div className="content">
        <div className="profileIcon">
          <img src={wilderavatar} alt="" />
        </div>
        <div className="infoContainer">
          <div className="next">
            <div className="n1">Next Drop in</div>
            <div className="n2">14:03</div>
            <div className="n3">
              <span className="symbol">?</span>
            </div>
          </div>
          <div className="desc">
            A new artwork '<span>Futopia</span>' by '<span>Frank Wilder</span>'
            is dropping soon.
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdBar;
