import React, { useState } from 'react'

import ValidatedInputStyle from './ValidatedInput.module.css'

const ValidatedInput = (props) => {

	const { type } = props
	const [ valid, setValid ] = useState(false)

	const inputChanged = e => {
		if(e.target.value.length >= 3) setValid(true)
		else setValid(false)
	}

	return(
		<div className={ValidatedInputStyle.validatedInput + ' ' + ( valid ? ValidatedInputStyle.valid : '')}>
			{ type == 'textarea' && <textarea onChange={inputChanged} /> }
			{ type != 'textarea' && <input onChange={inputChanged}  type={type}/> }
			{ valid && <div className={ValidatedInputStyle.symbol}></div> }
		</div>
	)
}

export default ValidatedInput