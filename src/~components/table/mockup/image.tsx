import React from 'react';
import kitty from '../../css/img/kitty.jpeg';
import cybercar from '../../css/img/cybercar.jpeg';
import realestate from '../../css/img/realestate.jpeg';
import elon from '../../css/img/elon.jpg';
import './image.scss';

const avatars = [kitty, cybercar, realestate, elon]

export default function image() {
  const randImg = () => avatars[Math.floor(Math.random() * avatars.length)]
  return (
    <div className="neo-demo">
      <img src={randImg()} alt="" className="neo2" />
    </div>
  );
}
