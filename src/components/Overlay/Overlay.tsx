//- React Imports
import React, { useState, useEffect } from 'react'

//- Style Imports
import styles from './Overlay.module.css'


type OverlayProps = {
	onClose: () => void;
	open?: boolean;
	children?: React.ReactNode;
}

const Overlay: React.FC<OverlayProps> = ({ onClose, open, children }) => {

	// TODO: Some overlays should be centered, other's should be top-aligned (with some padding of course)

	const [ currentChild, setCurrentChild ] = useState<React.ReactNode>(null)
	const [ inDOM, setInDOM ] = useState<boolean>(false)
	
	useEffect(() => {
		if(open) {
			setInDOM(true)
			if(document.body.className.indexOf('no-scroll') === -1) document.body.className += 'no-scroll'
		} else {
			// setTimeout(() => setInDOM(false), 1000)
		}
	}, [ open ])
	
	const removeFromDOM = (e: any) => {
		if(e.animationName.indexOf('close') >= 0) setInDOM(false)
	}

	const closeOverlay = (e: React.MouseEvent) => {
		const target = e.target as HTMLInputElement
		if(target.classList.value.indexOf('overlay') > -1) onClose()
	}

	return (
		<>
			{ inDOM && 
				<div onAnimationEnd={removeFromDOM} onClick={closeOverlay} className={`overlay ${styles.Overlay} ${open ? styles.Open : styles.Closed}`}>
					<div>
						{ children }
					</div>
				</div>
			}
		</>
	)
}

export default Overlay