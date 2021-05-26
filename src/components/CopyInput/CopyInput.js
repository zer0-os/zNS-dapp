import React from 'react';

import CopyInputStyle from './CopyInput.module.css';

import ethIcon from './assets/eth.svg';

const CopyInput = (props) => {
	return (
		<div style={props.style} className={CopyInputStyle.wallet}>
			<img alt="ethereum icon" src={ethIcon} />
			<span>Ethereum Address</span>
			<input type="text" value={props.value}></input>
			<button></button>
		</div>
	);
};

export default CopyInput;
