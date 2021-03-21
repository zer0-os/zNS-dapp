import React from 'react';
import neo from '../../css/img/neo.jpeg';
import './image.scss';

export default function image() {
  return (
    <div className="neo-demo">
      <img src={neo} alt="" className="neo2" />
    </div>
  );
}
