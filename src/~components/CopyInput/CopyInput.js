import React from 'react'

import CopyInputStyle from './CopyInput.module.css'

const CopyInput = (props) => {

	return (
		<div style={props.style} className={CopyInputStyle.wallet}>
			{/* <div className={CopyInputStyle.icon}></div> */}
			<div className={CopyInputStyle.stack}>
				<span>Ethereum Address</span>
				<input spellCheck='false' readOnly type='text' value={props.value}></input>
			</div>
			<button></button>
		</div>
	)
}

export default CopyInput