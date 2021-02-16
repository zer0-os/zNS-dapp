import React, { FC, useState, useEffect, useCallback } from 'react';
import { useDomainCache } from '../../lib/useDomainCache';

interface TableImageProps {
  domain: string;
}

const TableImage: FC<TableImageProps> = ({ domain: _domain }) => {
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  const [loadedIMG, setLoadedIMG] = useState<string>('');
  useEffect(() => {
    setLoadedIMG('');
  }, [domain, setLoadedIMG]);

  const _onLoad = useCallback(() => setLoadedIMG('domainImageFade'), [
    setLoadedIMG,
    domain,
  ]);

  if (domain.isNothing()) return null;
  return (
    <>
      <div className="domainImageContainer">
        {console.log('LOADED 1 ', loadedIMG)}
        <img
          onLoad={_onLoad}
          className={`domainImage ${loadedIMG}`}
          src={domain.value.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
          alt=""
        />
        {console.log('LOADED 2 ', loadedIMG)}
      </div>
      {console.log(domain.value.image, domain.value.domain)}
    </>
  );
};
export default TableImage;
