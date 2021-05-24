//- React Imports
import React, { useState, useEffect } from 'react'

//- Style Imports
import styles from './Overlay.module.css'


type OverlayProps = {
	onClose: () => void;
	open?: boolean;
	children?: React.ReactNode;
	centered?: boolean;
}

const Overlay: React.FC<OverlayProps> = ({ onClose, open, children, centered }) => {

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
				<div onAnimationEnd={removeFromDOM} onClick={closeOverlay} className={`overlay ${styles.Overlay} ${open ? styles.Open : styles.Closed} ${centered ? styles.Centered : ''}`}>
					<div className={`overlay`}>
						{ children }
						<div style={{display: centered ? 'none' : 'block', height: 64}}></div>
					</div>
				</div>
			}
		</>
	)
}

export default Overlay