//- React Imports
import React, { useState, useEffect } from 'react';
import ReactDOM from 'react-dom';

import { IconButton } from 'components';

//- Style Imports
import styles from './Overlay.module.scss';

import closeIcon from 'assets/close-icon.svg';

type OverlayProps = {
	onContentClick?: (e: React.UIEvent<HTMLElement, UIEvent>) => void;
	onClose: () => void;
	classNames?: string;
	open?: boolean;
	children?: React.ReactNode;
	centered?: boolean;
	nested?: boolean;
	img?: boolean;
	fullScreen?: boolean;
	style?: React.CSSProperties;
	hasCloseButton?: boolean;
};

const Overlay: React.FC<OverlayProps> = ({
	classNames,
	onContentClick,
	onClose,
	open,
	children,
	centered,
	img,
	nested,
	fullScreen,
	style,
	hasCloseButton = true,
}) => {
	const [inDOM, setInDOM] = useState<boolean>(false);
	const [domId, setDomId] = useState('');

	const makeId = (length: number) => {
		var result = '';
		var characters =
			'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
		var charactersLength = characters.length;
		for (var i = 0; i < length; i++) {
			result += characters.charAt(Math.floor(Math.random() * charactersLength));
		}
		return result;
	};

	useEffect(() => {
		const id = 'overlay_' + makeId(8);
		const e = document.createElement('div');
		e.id = id;
		document.body.appendChild(e);
		setDomId('#' + id);
		return () => {
			if (document) {
				const el = document.querySelector('#' + id);
				if (el) el.outerHTML = '';
			}
		};
	}, []);

	useEffect(() => {
		if (open) {
			setInDOM(true);
			if (document.body.className.indexOf('no-scroll') === -1)
				document.body.className += 'no-scroll';
		}
		return () => {
			document.body.classList.remove('no-scroll');
		};
	}, [open]);

	const removeFromDOM = (e: any) => {
		if (nested) return;
		if (e.animationName.indexOf('close') >= 0) setInDOM(false);
	};

	const closeOverlay = (e: React.MouseEvent) => {
		e.stopPropagation();
		const target = e.target as HTMLInputElement;
		const overlay = document.querySelector(domId);
		if (
			target.classList.value.indexOf('overlay') > -1 &&
			overlay?.contains(target)
		)
			onClose();
	};

	if (!domId.length) return <></>;

	const overlayDiv = document.querySelector(domId);

	const portalDiv = (
		<div
			onAnimationEnd={removeFromDOM}
			onClick={closeOverlay}
			style={style}
			className={`overlay ${classNames || ''} ${styles.Overlay} ${
				open ? styles.Open : styles.Closed
			} ${centered ? styles.Centered : ''}
			${fullScreen ? styles.FullScreen : ''}`}
		>
			{hasCloseButton && (
				<IconButton
					className={styles.Close}
					onClick={onClose}
					iconUri={closeIcon}
					style={{ height: 32, width: 32, padding: 6 }}
				/>
			)}
			<div className={`overlay ${styles.Container} ${img ? styles.Image : ''}`}>
				<div
					className={`overlay ${styles.Content}`}
					onClick={onContentClick && onContentClick}
				>
					{children}
				</div>
				<div style={{ display: centered ? 'none' : 'block', height: 64 }}></div>
			</div>
		</div>
	);

	if (nested) {
		return portalDiv;
	} else {
		return overlayDiv
			? ReactDOM.createPortal(<>{inDOM && portalDiv}</>, overlayDiv)
			: null;
	}
};

export default Overlay;
