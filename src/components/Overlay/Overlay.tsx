import React from 'react'

type OverlayProps = {
	onClose: () => void;
	children: React.ReactNode;
}

const Overlay: React.FC<OverlayProps> = ({ onClose, children }) => {

	// TODO: Some overlays should be centered, other's should be top-aligned (with some padding of course)

	const closeOverlay = (e: React.MouseEvent) => {
		const target = e.target as HTMLInputElement
		if(target.classList.value.indexOf('overlay') > -1) onClose()
	}

	return (
		<>
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
		<h1>Overlay scrolling is a little broken right now - this will be fixed</h1>
		</>
	)
}

export default Overlay