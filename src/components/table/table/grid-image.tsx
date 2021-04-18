import { FC, useState, useEffect, useCallback } from 'react';
import { useDomainCache } from '../../../lib/useDomainCache';

import StaticEmulator from '../../../lib/StaticEmulator/StaticEmulator.js'

interface GridImageProps {
  domain: string;
  props: any;
}

const GridImage: FC<GridImageProps> = ({ domain: _domain, props }) => {
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { name } = domainContext;
  const [loadedIMG, setLoadedIMG] = useState<string>('');
  useEffect(() => {
    setLoadedIMG('');
  }, [name, setLoadedIMG]);

  const _onLoad = useCallback(() => setLoadedIMG('domainImageFade'), [
    setLoadedIMG,
  ]);

  console.log(loadedIMG)
  

  if (name.isNothing()) return null;
  return (
    <img
      style={{ maxHeight: '100%' }}
      onLoad={_onLoad}
      className={` ${loadedIMG}`}
      src={props.image}
      alt=""
    />
  );
};
export default GridImage;
