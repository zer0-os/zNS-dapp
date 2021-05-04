import { FC } from 'react';
import { useDomainCache } from '../../../lib/useDomainCache';

interface TableImageGlobalProps {
  domain: string;
}

const TableImageGlobal: FC<TableImageGlobalProps> = ({ domain: _domain }) => {
  // const { useDomain } = useDomainCache();
  // const domainContext = useDomain(_domain);
  // if (domain.isNothing()) return null;

  return (
    <>
      {/* TODO: check if there is no image file
      {domain.isJust() && (
        <img
          className="neo2"
          src={domain.value.image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
          alt=""
        />
      )} */}
    </>
  );
};
export default TableImageGlobal;
