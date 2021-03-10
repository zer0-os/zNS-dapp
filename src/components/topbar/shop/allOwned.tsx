import { FC, useMemo } from 'react';
import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { useZnsContracts } from '../../../lib/contracts';
import {
  useDomainCache,
} from '../../../lib/useDomainCache';

const AllOwned: FC = () => {
  const context = useWeb3React<Web3Provider>();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const contracts = useZnsContracts();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { library, account, active, chainId } = context;

  const { owned } = useDomainCache();

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const allOwned = useMemo(
    () =>
      owned.isNothing()
        ? []
        : owned.value.map((control) => {
          return control.image;
        }),
    [owned],
  );

  if (owned.isNothing()) return null;

  return (
    <>
      <div>
        {owned.value.map((control) => {
          return <div key={control.domain}>{control.domain}</div>;
        })}
      </div>
    </>
  );
};

export default AllOwned;
