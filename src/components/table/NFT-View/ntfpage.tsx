import { FC, useEffect, useState } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useDomainCache } from '../../../lib/useDomainCache';
import { Link, useLocation } from 'react-router-dom';
import _ from 'lodash';
import './css/nftpage.scss';
import TableImage from '../table/table-image';
// import NFTImage from './nft-image';
import neo2 from './img/neo2.jpeg';
import nFTpAGE from '../../css/video/nFTpAGE.mp4';
import neo from './img/mockusers/neo.png';
import cat from './img/mockusers/cat.png';
import phoenix from './img/mockusers/phoenix.png';
import vape from './img/mockusers/vape.png';
import Modal from 'antd/lib/modal/Modal';
import wilder from './img/mockusers/wilder.png';

import FutureButton from '../../Buttons/FutureButton/FutureButton.js';
import Enlist from '../../Enlist/Enlist';

import StaticEmulator from '../../../lib/StaticEmulator/StaticEmulator.js';

interface ProfileProps {
  domain: string;
}

const NFTPage: FC<ProfileProps> = ({ domain: _domain }) => {
  const [isNftVisible, setNftVisible] = useState(false);
  const context = useWeb3React<Web3Provider>();
  const { library, account, active, chainId } = context;
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { name } = domainContext;
  const location = useLocation();
  const [image, setImage] = useState('');
  const [create, setCreator] = useState(null);
  const [meta, setData] = useState(null);
  const [descript, setDescription] = useState(null);
  const [own, setOwner] = useState(null);
  const [isPreviewOpen, setPreviewOpen] = useState(false);
  const openPreview = () => setPreviewOpen(true);
  const closePreview = () => setPreviewOpen(false);

  const [enlist, setEnlist] = useState(false);
  const openEnlist = () => setEnlist(true);
  const closeEnlist = () => setEnlist(false);

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
        if (name.isNothing()) return;
        let cid = await ipfsClient.cat(name.value.metadata.slice(21));

        console.log(cid + '');
        let desc = JSON.parse(cid).description;
        let img = JSON.parse(cid).image;
        let cre = JSON.parse(cid).creator;
        let own = JSON.parse(cid).owner;

        setData(cid);
        setImage(img);
        setDescription(desc);
        setCreator(cre);
        setOwner(own);
      };
      ipfsreq();
    }
    console.log('useEffect');
  }, [descript, name, image]);

  const showNft = () => {
    setNftVisible(true);
  };

  const nftOk = () => {
    setNftVisible(false);
  };

  const nftCancel = () => {
    setNftVisible(false);
  };

  // const historyRow = (name: string, number: string, days: string, img: any) => {
  //   return (
  //     <div className="historyRow">
  //       <div className="historyLeft">
  //         <img src={img} alt="" className="avatar" />
  //         <div className="historyText">
  //           <span className="embolden">{name}</span> placed a bid for{' '}
  //           <span className="embolden">{number} WILD</span>
  //         </div>
  //       </div>
  //       {/* <div className="historyRight">
  //         {days} days ago <span className="viewTx">[view tx]</span>
  //       </div> */}
  //     </div>
  //   );
  // };

  if (name.isNothing()) return null;
  return (
    <div className="nftView">
      <div
        style={{
          background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("assets/galaxy.jpeg")`,
        }}
        className="showcase border-primary"
      >
        <div className="showcaseIMG">
          <img
            onClick={openPreview}
            style={{ height: '100%', width: '100%' }}
            src={image}
          />
          {/* <NFTImage domain={domain.value.domain} /> */}
        </div>
        <div className="showcaseInfo">
          <div className="topmid">
            <div className="top">
              <div className="title glow-text-white">
                {routes[routes.length - 1][0]}
              </div>
              <div className="domain">
                <Link to={location.pathname} className="network">
                  0:/{location.pathname}
                </Link>
              </div>
            </div>
            <div className="middle">
              <div className="midLeft">
                <div className="units"></div>
                <div className="price"></div>
              </div>
              {/* <div className="midRight">
              <div className="text">Current Price</div>
              <div className="units">65,045 LOOT</div>
              <div className="price">$23,401,123.43</div>
            </div> */}
            </div>
          </div>
          <div className="showcaseBottom">
            <div className="shadowContainer">
              <FutureButton onClick={openEnlist} glow>
                Enlist
              </FutureButton>
            </div>
          </div>
        </div>
      </div>
      <div className="info">
        <div className="story border-primary">
          <div>DESCRIPTION</div>
          <div style={{ fontSize: 16 }}>{descript}</div>
        </div>
        <div className="quad">
          <div className="address border-primary">
            <div className="quadHeader">
              <span>ETH ADDRESS</span>
              <span className="infoButton">
                <span className="infoMark">?</span>
              </span>
            </div>
            <div className="quadText">
              {account && account.length
                ? account
                : 'Connect a wallet to see your Ethereum address!'}
            </div>
          </div>
        </div>
      </div>

      <Modal
        visible={isPreviewOpen}
        onCancel={closePreview}
        closable={false}
        centered
        footer={null}
      >
        <img src={image} />
      </Modal>
      <Modal
        visible={enlist}
        onCancel={closeEnlist}
        closable={false}
        centered
        footer={null}
      >
        <Enlist
          name={location.pathname}
          props={{
            image: image,
            close: closeEnlist,
          }}
        />
      </Modal>
    </div>
  );
};
export default NFTPage;
