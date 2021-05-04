import { Web3Provider } from '@ethersproject/providers';
import { useWeb3React } from '@web3-react/core';
import { FC } from 'react';
import { useDomainCache } from '../../../lib/useDomainCache';

const Owned: FC = () => {
  const context = useWeb3React<Web3Provider>();

  const { library, account, active, chainId } = context;

  const { owned } = useDomainCache();

  const gridCell = () => {
    return (
      <div className="gridCell">
        <div className="topCell">
          <div className="cellImage"></div>
        </div>
        <div className="bottomCell">
          <div className="name"></div>
          <div className="domain"></div>
          <div className="desc">
            <div className="ticker">XYZ</div>
            <div className="holders">X Holdes</div>
          </div>
          <div className="price">$1234.00</div>
          <div className="bottom">
            <span className="eth-price">(Eth price)</span>
            <span className="cell-btn">
              <button> transfer Modal</button>
            </span>
          </div>
        </div>
      </div>
    );
  };

  // // eslint-disable-next-line @typescript-eslint/no-unused-vars

  if (owned.isJust()) {
    owned.value.map((own) => {
      own.owned.push(ownedCells);
    });
  }
  const ownedCells: any = [];

  // //console.log('all owned', ownedCells);
  const cells: any = [];
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());
  cells.push(gridCell());

  if (owned.isNothing()) return <p>User owns no domains.</p>;

  return (
    <>
      <div className="gridContainer-profile">{cells}</div>
    </>
  );
};

export default Owned;
