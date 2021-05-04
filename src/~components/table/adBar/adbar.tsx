import { FC, useState, useEffect, useRef } from 'react';
import _ from 'lodash';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { Link, useLocation } from 'react-router-dom';
import { useHistory } from 'react-router-dom';
import { useZnsContracts } from '../../../lib/contracts';
import { useDomainCache } from '../../../lib/useDomainCache';
import './css/adbar.scss';
import adbg from './img/adbg.png';
import wilderavatar from '../../css/img/wilderavatar.png';

interface AdBarProps {
  domain: string;
}

const AdBar: FC<AdBarProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();

  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const contracts = useZnsContracts();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const { account } = context;
  const { useDomain } = useDomainCache();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  // const { _allDomains, refetchAllDomains } = useAllDomains(_domain);
  const domainContext = useDomain(_domain);
  const { name } = domainContext;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const history = useHistory();
  const [timeMinutes, setTimeMinutes] = useState<any>('00');
  const [timeSeconds, setTimeSeconds] = useState<any>('00');

  let interval: any = useRef();

  const startTimer = () => {
    const countdownDate = new Date('April 15, 2021 00:00:00').getTime();
    interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = countdownDate - now;
      let minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      let seconds = Math.floor((diff % (1000 * 60)) / 1000);

      if (diff < 0) {
        clearInterval(interval.current);
      } else {
        setTimeMinutes(minutes);
        setTimeSeconds(seconds);
      }
    }, 1000);
  };
  // useEffect(() => {
  //   const someref = interval.current;
  //   startTimer();
  //   return () => {
  //     clearInterval(someref);
  //   };
  // }, []);

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

  // const timer = () => {
  //   let seconds = 1000;
  //   let minuets = seconds * 60;
  // };

  if (name.isNothing()) return null;

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
            <div className="n2">
              {timeMinutes}:{timeSeconds}
            </div>
            <div className="n3">
              <span className="symbol">?</span>
            </div>
          </div>
          <div className="desc">
            <span className="glow-text-blue">
              A new artwork '<span>Futopia</span>' by '<span>Frank Wilder</span>
              ' is dropping soon.
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdBar;
