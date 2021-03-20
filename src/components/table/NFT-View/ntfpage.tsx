import { FC, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useDomainCache } from '../../../lib/useDomainCache';
import { Link, useLocation } from 'react-router-dom';
import _ from 'lodash';
import '../../css/nftpage.scss';
import TableImage from '../table-image';

interface ProfileProps {
  domain: string;
}

const NFTPage: FC<ProfileProps> = ({ domain: _domain }) => {
  const [isNftVisible, setNftVisible] = useState(false);
  const context = useWeb3React<Web3Provider>();
  const { library, account, active, chainId } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  const location = useLocation();

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

  const showNft = () => {
    setNftVisible(true);
  };

  const nftOk = () => {
    setNftVisible(false);
  };

  const nftCancel = () => {
    setNftVisible(false);
  };

  if (domain.isNothing()) return null;
  return (
    <div className="nftView">
      <div className="showcase"></div>
      <div className="info">
        <div className="story"></div>
        <div className="quad">
          <div className="top">
            <div className="last"></div>
            <div className="change"></div>
          </div>
          <div className="bottom">
            <div className="resale"></div>
            <div className="original"></div>
          </div>
        </div>
      </div>
      <div className="stats">
        <div className="growth"></div>
        <div className="market"></div>
      </div>
      <div className="bottom">
        <div className="chat"></div>
        <div className="history"></div>
      </div>
    </div>
  );
};
export default NFTPage;
