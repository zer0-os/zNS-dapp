import React from 'react'

const Overlay = ({ close, children }) => {

	const closeOverlay = (e) => {
		if(e.target.classList.value.indexOf('overlay') > -1) close()
	}

	return (
		<div onClick={closeOverlay} style={{
			width: '100%', minHeight: '100vh', 
			display: 'flex', alignItems: 'center', 
			justifyContent: 'center',
			position: 'absolute',
			top: 0,
			left: 0,
			zIndex: 100,
			paddingTop: 120,
			paddingBottom: 120
		}} className='blur overlay'>
			{children}
		</div>
	)
}

export default Overlay