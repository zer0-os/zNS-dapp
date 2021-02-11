import React, { FC } from 'react';
import '../css/grid.scss';

interface GridProps {
  domain: string;
}

const gridCell = () => {
  return (
    <div className="gridCell">
      <div className="cellTop"></div>
      <div className="cellBottom">
        <div className="cellTextTop">NFT Name</div>
        <div className="cellTextMiddle">ticker</div>
        <div className="cellTextBottom">
          <span>Left</span>
          <span>Right</span>
        </div>
      </div>
    </div>
  );
};

const cells = gridCell();

const Grid: FC<GridProps> = () => {
  return <div className="gridContainer">{cells}</div>;
};

export default Grid;
