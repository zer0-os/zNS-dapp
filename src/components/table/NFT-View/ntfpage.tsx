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
import Image from '../../Image/Image';

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
  const { domain } = domainContext;
  const location = useLocation();
  const [image, setImage] = useState('');
  const [create, setCreator] = useState(null);
  const [meta, setData] = useState(null);
  const [title, setTitle] = useState(null);
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
        if (domain.isNothing()) return;
        const metadataContents = await ipfsClient.cat(domain.value.metadata.slice(21));

        const metadata = JSON.parse(metadataContents)
        let desc = metadata.description;
        let img = metadata.image;
        let cre = metadata.creator;
        let own = metadata.owner;
        let title = metadata.title;

        setData(metadataContents);
        setImage(img);
        setDescription(desc);
        setCreator(cre);
        setOwner(own);
        setTitle(title);
      };
      ipfsreq();
    }
  }, [descript, domain, image]);

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
      <div
        style={{
          background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.7)), url("assets/galaxy.jpeg")`,
        }}
        className="showcase border-primary"
      >
        <div className="showcaseIMG">
          <Image
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
                {title ? title : domain.value.name}
              </div>
              <div className="creatorFlex">
                <a href={window.location.href} className="creatorText">0://{domain.value.name}</a>
              </div>

              <div className="users">
                <div className="creator">
                  <img src={wilder} alt="" className="avatar" />
                  <div className="creatorFlex">
                    <a href={`https://etherscan.io/address/${domain.value.minter.id}`} className="creatorText">{domain.value.minter.id.slice(0, 12)}...</a>
                    <div className="desc">Creator</div>
                  </div>
                </div>
                <div className="owner">
                  <img src={neo} alt="" className="avatar" />
                  <div className="ownerFlex">
                    <a href={`https://etherscan.io/address/${domain.value.owner.id}`} className="ownerText">{domain.value.owner.id.slice(0, 12)}...</a>
                    <div className="desc">Owner</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="middle">
              {/* <div className="midLeft">
                <div className="units">hello</div>
                <div className="price">hello</div>
              </div> */}
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
              <span>CONTRACT ADDRESS</span>
            </div>
            <div className="quadText all-select">
              <a href="https://kovan.etherscan.io/address/0x7EB6D0E8c91F6e88bf029138FDf0d04Fb78E43a4">
                0x7EB6D0E8c91F6e88bf029138FDf0d04Fb78E43a4
              </a>
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
        style={{ width: '600px !important' }}
      >
        <Image src={image} />
      </Modal>
      <Modal
        visible={enlist}
        onCancel={closeEnlist}
        closable={false}
        centered
        footer={null}
      >
        <Enlist
          domain={domain.value.name}
          props={{
            name: domain.value.name,
            image: image,
            close: closeEnlist,
          }}
        />
      </Modal>
    </div>
  );
};
export default NFTPage;
