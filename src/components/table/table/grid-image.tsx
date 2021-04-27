import { FC, useState, useEffect, useCallback } from 'react';
import { useDomainCache } from '../../../lib/useDomainCache';

import StaticEmulator from '../../../lib/StaticEmulator/StaticEmulator.js';

interface GridImageProps {
  domain: string;
  props: any;
}

const GridImage: FC<GridImageProps> = ({ domain: _domain, props }) => {
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { name } = domainContext;
  const [image, setImage] = useState('');
  const [descript, setDescription] = useState(null);
  const [loadedIMG, setLoadedIMG] = useState<string>('');
  useEffect(() => {
    setLoadedIMG('');
  }, [name, setLoadedIMG]);

  const _onLoad = useCallback(() => setLoadedIMG('domainImageFade'), [
    setLoadedIMG,
  ]);

  console.log(loadedIMG);

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
        let _hash = await ipfsClient
          .cat(name.value.metadata)
          .catch((err: any) => console.log);

        let img = JSON.parse(_hash).image;
        let desc = JSON.parse(_hash).description;
        setImage(img);
        setDescription(desc);
      };
      ipfsreq();
    }
    console.log('useEffect');
  }, [name, image]);
  //

  if (name.isNothing()) return null;
  return (
    <img
      style={{ maxHeight: '100%' }}
      className={` ${loadedIMG}`}
      src={image}
      alt=""
    />
  );
};
export default GridImage;
