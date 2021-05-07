import React from 'react'

import HorizontalScrollStyles from './HorizontalScroll.module.css'

const HorizontalScroll = (props) => {

	console.log(props)

    return (
    	<div style={props.style} className={`${props.className ? props.className : ''} ${HorizontalScrollStyles.bar}`}>
    		{props.children}
    		<div style={{width: 0, minWidth: 0, marginLeft: 48, opacity: 0}}>hi</div>
    	</div>
    	                    
    )
}

export default HorizontalScroll