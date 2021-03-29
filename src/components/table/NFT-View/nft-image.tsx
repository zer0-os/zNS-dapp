import React, { FC, useState, useEffect, useCallback } from 'react';
import { useDomainCache } from '../../../lib/useDomainCache';
import './css/nft-view.scss';

interface NFTImageProps {
  domain: string;
}

const NFTImage: FC<NFTImageProps> = ({ domain: _domain }) => {
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  const [loadedIMG, setLoadedIMG] = useState<string>('');
  useEffect(() => {
    setLoadedIMG('');
  }, [domain, setLoadedIMG]);

  const _onLoad = useCallback(() => setLoadedIMG('domainImageFade'), [
    setLoadedIMG,
  ]);

  if (domain.isNothing()) return null;
  return (
    <>
      <div className="NFTImageContainer">
        <img
          onLoad={_onLoad}
          className={`NFTImage ${loadedIMG}`}
          src={domain.value.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
          alt=""
        />
      </div>
      {/*console.log(domain.value.image, domain.value.domain)*/}
    </>
  );
};
export default NFTImage;
