import { FC, useMemo } from 'react';
import '../css/grid.scss';
import { useWeb3React } from '@web3-react/core';
import { useZnsContracts } from '../../lib/contracts';
import { useDomainCache } from '../../lib/useDomainCache';
import { Web3Provider } from '@ethersproject/providers';
import TableImage from './table-image';

interface GridProps {
  domain: string;
}

// const gridCell = (domain) => {
//   return (
//     <div className="gridCell">
//       <div className="cellTop"></div>
//       <div className="cellBottom">
//         <div className="cellTextTop">NFT Name</div>
//         <div className="cellTextMiddle">ticker</div>
//         <div className="cellTextBottom">
//           <span>Left</span>
//           <span>Right</span>
//         </div>
//       </div>
//     </div>
//   );
// };

// const cells: any = [];
// cells.push(gridCell());
// cells.push(gridCell());
// cells.push(gridCell());
// cells.push(gridCell());
// cells.push(gridCell());
// cells.push(gridCell());
// cells.push(gridCell());
// cells.push(gridCell());

const Grid: FC<GridProps> = ({ domain: _domain }) => {
  const context = useWeb3React<Web3Provider>();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { account } = context;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const contracts = useZnsContracts();
  const domainStore = useDomainCache();
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { useAllDomains, useDomain } = domainStore;
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { domain, refetchDomain } = useDomain(_domain);

  const gridCell = (name: string) => {
    return (
      <div className="gridCell">
        <div className="topCell">
          {/* <img
            className="cellImage"
            src={image.replace('ipfs://', 'https://ipfs.io/ipfs/')}
            alt=""
          /> */}
          <TableImage domain={name} />
        </div>
        <div className="bottomCell">
          {/* <div className="name">{name}</div> */}
          <div className="name">{name.match(/[^.]+$/)}</div>
          <div className="domain">O::/{name}</div>
          <div className="desc">
            <div className="ticker">Ticker</div>
            <div className="holders">X Holders</div>
          </div>
          <div className="price">$1234.00</div>
          <div className="bottom">
            <span className="eth-price">(Ξ 1.0015)</span>
            <span className="cell-btn">Trade</span>
          </div>
        </div>
      </div>
    );
  };

  const gridCells = useMemo(
    () =>
      domain.isNothing()
        ? []
        : domain.value.children.map((key, i) => {
          return gridCell(key);
        }),
    [domain],
  );
  if (domain.isNothing()) return null;
  //console.log('GRID CHILDREN!!!', domain.value.children);
  return <div className="gridContainer">{gridCells}</div>;
};

export default Grid;
