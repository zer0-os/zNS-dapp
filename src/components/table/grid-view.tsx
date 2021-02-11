import React, { FC } from 'react';
import '../css/grid.scss';

interface GridProps {}

const gridCell = () => {
  return (
    <div className="gridCell">
      <div className="cellTop">top</div>
      <div className="cellBottom">
        <div>NFT Name</div>
        <div>ticker</div>
        <div>
          <div>Left</div>
          <div>Right</div>
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
