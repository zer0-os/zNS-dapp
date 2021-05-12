import React from 'react'

import HorizontalScrollStyles from './HorizontalScroll.module.css'

const HorizontalScroll = (props) => {

    return (
    	<div style={props.style} className={`${props.className ? props.className : ''} ${HorizontalScrollStyles.bar}`}>
    		{props.children}
    	</div>
    	                    
    )
}

export default HorizontalScroll