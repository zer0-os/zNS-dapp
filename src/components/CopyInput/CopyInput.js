import React from 'react';

import CopyInputStyle from './CopyInput.module.css';

import useNotification from 'lib/hooks/useNotification';

import ethIcon from './assets/eth.svg';

const CopyInput = (props) => {
	const { addNotification } = useNotification();

	const copyContractToClipboard = () => {
		addNotification('Copied address to clipboard.');
		navigator.clipboard.writeText(props.value);
	};

	return (
		<div style={props.style} className={CopyInputStyle.wallet}>
			<img alt="ethereum icon" src={ethIcon} />
			<span>Ethereum Address</span>
			<input onChange={() => {}} type="text" value={props.value}></input>
			<button onClick={copyContractToClipboard}></button>
		</div>
	);
};

export default CopyInput;
