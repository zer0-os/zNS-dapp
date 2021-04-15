import { FC, useState, useEffect, useCallback } from 'react';
import { useDomainCache } from '../../../lib/useDomainCache';

interface GridImageProps {
  domain: string;
}

const GridImage: FC<GridImageProps> = ({ domain: _domain }) => {
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

  if (name.isNothing()) return null;
  console.log('GRIDIMAGE ', name);
  console.log('GRIDMETADATA', name.value.metadata.image);
  return (
    <img
      style={{ maxHeight: '100%' }}
      onLoad={_onLoad}
      className={` ${loadedIMG}`}
      src={name.value.metadata.image}
      alt=""
    />
  );
};
export default GridImage;
