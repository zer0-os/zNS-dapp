import { FC, useState, useEffect, useCallback } from 'react';
import { useDomainCache } from '../../../lib/useDomainCache';

interface GridImageProps {
  domain: string;
}

const GridImage: FC<GridImageProps> = ({ domain: _domain }) => {
  // const { useDomain } = useDomainCache();
  // const domainContext = useDomain(_domain);
  // const { domain } = domainContext;
  // const [loadedIMG, setLoadedIMG] = useState<string>('');
  // useEffect(() => {
  //   setLoadedIMG('');
  // }, [domain, setLoadedIMG]);

  // const _onLoad = useCallback(() => setLoadedIMG('domainImageFade'), [
  //   setLoadedIMG,
  // ]);

  // if (domain.isNothing()) return null;
  return (
    <> </>
    // <img
    //   style={{ maxHeight: '100%' }}
    //   onLoad={_onLoad}
    //   className={` ${loadedIMG}`}
    //   src={domain.value.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
    //   alt=""
    // />
  );
};
export default GridImage;
