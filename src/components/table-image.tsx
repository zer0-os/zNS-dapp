import React, { FC } from 'react';
import { useDomainCache } from '../lib/useDomainCache';

interface TableImageProps {
  domain: string;
}

const TableImage: FC<TableImageProps> = ({ domain: _domain }) => {
  const { useDomain } = useDomainCache();
  const domainContext = useDomain(_domain);
  const { domain } = domainContext;
  if (domain.isNothing()) return null;

  return (
    <>
      {/* TODO: check if there is no image file */}
      {domain.isJust() && (
        <img
          className="domainImage"
          src={domain.value.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
          alt=""
        />
      )}
      {console.log(domain.value.image, domain.value.domain)}
    </>
  );
};
export default TableImage;
