import React from 'react';
import wilderavatar from '../../css/img/wilderavatar.png';
import neo from '../../css/img/neo.jpeg';
import kitty from '../../css/img/kitty.jpeg';
import cybercar from '../../css/img/cybercar.jpeg';
import realestate from '../../css/img/realestate.jpeg';
import elon from '../../css/img/elon.jpg';
import './image.scss';

export default function image() {
  const randImg = () => {
    let seed = Math.floor(Math.random() * 12);
    if (seed >= 0 && seed < 2) {
      return neo;
    } else if (seed >= 2 && seed < 4) {
      return kitty;
    } else if (seed >= 4 && seed < 6) {
      return cybercar;
    } else if (seed >= 6 && seed < 8) {
      return realestate;
    } else if (seed >= 8 && seed < 10) {
      return wilderavatar;
    } else return elon;
  };
  return (
    <div className="neo-demo">
      <img src={randImg()} alt="" className="neo2" />
    </div>
  );
}
