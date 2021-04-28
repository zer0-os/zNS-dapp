import { FC, useEffect, useMemo, useState } from 'react';
import './css/grid.scss';
import { useHistory } from 'react-router-dom';
import { useWeb3React } from '@web3-react/core';
import { useDomainCache } from '../../../lib/useDomainCache';
import { Web3Provider } from '@ethersproject/providers';
import TableImage from './table-image';
import GridImage from './grid-image';
import avatar from '../../css/img/wilderavatar.png';
import { Indexed } from '@ethersproject/abi';
import { inflate } from 'node:zlib';

import StaticEmulator from '../../../lib/StaticEmulator/StaticEmulator.js';

interface GridProps {
  domain: string;
}

const Grid: FC<GridProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();

  const { account } = context;
  const domainStore = useDomainCache();
  const { useDomain } = domainStore;
  const { name } = useDomain(_domain);

  const history = useHistory();
  const handleCellClick = (name: any) => {
    //console.log('fire');
    history.push({
      pathname: name,
    });
  };

  const [image, setImage] = useState('');
  const [descript, setDescription] = useState(null);
  const [imageCount, setImageCount] = useState(0)

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
        if (name.isNothing() || !name.value.subdomains.length) return;

        // Go through each subdomain
        for(var i = 0; i < name.value.subdomains.length; i++) {
          const sub = name.value.subdomains[i]
          const _hash = await ipfsClient.cat(sub.metadata.slice(21))
          sub.image = JSON.parse(_hash).image
          setImageCount(i + 1)
        }
      };
      ipfsreq();
    }
  }, [name]);
  

  //
  // The following functions generate random numbers for mock data display
  //

  const randThreeS = () => {
    let temp =
      Math.random() > 0.5
        ? Math.floor(Math.random() * 1000).toString()
        : Math.floor(Math.random() * 100).toString();
    if (temp === '0') {
      temp = '10';
    }
    return temp;
  };

  const randPrice = () => {
    let temp = Math.floor(Math.random() * 100).toString();
    let dot = Math.floor(Math.random() * 100).toString();
    if (dot.length === 1) {
      dot = '0' + dot;
    }
    let up = Math.random() > 0.3;
    let price = `${up ? '▲' : '▼'} ${temp}.${dot}%`;
    return (
      <div style={{ color: `${up ? '#27AE60' : '#EB5757'}` }}>{price}</div>
    );
  };

  //
  //
  //

  const gridCell = (key: any, i: any) => {
    return (
      <div onClick={() => handleCellClick(key.name)} className="gridCell">
        <div className="gridCellContent">
          <div className="topbar">
            {/* <div className="dots">
              <div></div>
              <div></div>
              <div></div>
            </div> */}
          </div>
          <div className="name">
            <div>{key.name.match(/[^.]+$/)}</div>
          </div>
          <div className="image">
            
            <img src={key.image ? key.image : ''} />
          </div>
          {/* <div className="text">
            <div>Last Traded Price</div>
            <div>Change</div>
          </div> */}
        </div>
      </div>
    );
  };

  const domain: any = true;

  const gridCells = useMemo(
    () =>
      name.isNothing()
        ? []
        : name.value.subdomains.map((key: any, i: number) => {
            return gridCell(key, i);
          }),
    [name, imageCount],
  );
  if (name.isNothing()) return null;
  return (
    <div className="gridContainer">
      <div className="gridMargin">{gridCells}</div>
    </div>
  );
};

export default Grid;
