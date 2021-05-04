import React from 'react'

import ButtonStyle from './ButtonTray.module.css'

const ButtonTray = (props) => {
	return (
		<div className={ButtonStyle.tray + ' purple-border-blur'}>
			{props.children}
		</div>
	)
}

export default ButtonTray