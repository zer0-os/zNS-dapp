import { FC, useMemo } from 'react';
import '../css/grid.scss';
import { useHistory } from 'react-router-dom';
// import { useWeb3React } from '@web3-react/core';
import { useDomainCache } from '../../lib/useDomainCache';
// import { Web3Provider } from '@ethersproject/providers';
import TableImage from './table-image';
import avatar from '../css/img/wilderavatar.png';

interface GridProps {
  domain: string;
}

const Grid: FC<GridProps> = ({ domain: _domain }) => {
  // const context = useWeb3React<Web3Provider>();

  // const { account } = context;
  const domainStore = useDomainCache();
  const { useDomain } = domainStore;
  const { domain } = useDomain(_domain);

  const history = useHistory();
  const handleCellClick = (name: any) => {
    //console.log('fire');
    console.log(name);
    history.push({
      pathname: name,
    });
  };

  //
  // The following functions generate random numbers for mock data display
  //

  const randThreeS = () => {
    let temp =
      Math.random() > 0.5
        ? Math.floor(Math.random() * 1000).toString()
        : Math.floor(Math.random() * 100).toString();
    if (temp === '0') {
      temp = '10';
    }
    return temp;
  };

  const randPrice = () => {
    let temp = Math.floor(Math.random() * 100).toString();
    let dot = Math.floor(Math.random() * 100).toString();
    if (dot.length === 1) {
      dot = '0' + dot;
    }
    let up = Math.random() > 0.3;
    let price = `${up ? '▲' : '▼'} ${temp}.${dot}%`;
    return (
      <div style={{ color: `${up ? '#27AE60' : '#EB5757'}` }}>{price}</div>
    );
  };

  //
  //
  //

  const gridCell = (name: string) => {
    return (
      // <div className="gridCell">
      //   <div className="topCell">
      //     <TableImage domain={name} />
      //   </div>
      //   <div className="bottomCell">
      //     <div className="name">{name.match(/[^.]+$/)}</div>
      //     <div className="domain">O::/{name}</div>
      //     <div className="desc">
      //       <div className="ticker">Ticker</div>
      //       <div className="holders">X Holders</div>
      //     </div>
      //     <div className="price">$1234.00</div>
      //     <div className="bottom">
      //       <span className="eth-price">(Ξ 1.0015)</span>
      //       <span className="cell-btn">Trade</span>
      //     </div>
      //   </div>
      // </div>
      <div onClick={() => handleCellClick(name)} className="gridCell">
        <div className="gridCellContent">
          <div className="topbar">
            <div className="left">
              <div className="avatar">
                <img src={avatar} alt="" />
              </div>
              <div className="artist">WILDER</div>
            </div>
            <div className="dots">
              <div></div>
              <div></div>
              <div></div>
            </div>
          </div>
          <div className="name">
            <div>{name.match(/[^.]+$/)}</div>
          </div>
          <div className="image">
            <TableImage domain={name} />
          </div>
          <div className="text">
            <div>Last Traded Price</div>
            <div>Change</div>
          </div>
          <div className="price">
            <div>{randThreeS()} WILD</div>
            <div>{randPrice()}</div>
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
  return (
    <div className="gridContainer">
      <div className="gridMargin">{gridCells}</div>
    </div>
  );
};

export default Grid;
