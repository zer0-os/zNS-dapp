//- React Imports
import React, { useEffect, useRef } from 'react';

//- Library imports
import ModelViewer from '@metamask/logo';

//- Style Imports
import styles from './WalletInteraction.module.scss';
import { Checkbox } from 'components';

const WalletInteraction = () => {
	const viewer = ModelViewer({
		// Dictates whether width & height are px or multiplied
		pxNotRatio: true,
		width: 64,
		height: 64,
		// pxNotRatio: false,
		// width: 0.9,
		// height: 0.9,

		// To make the face follow the mouse.
		followMouse: true,

		// head should slowly drift (overrides lookAt)
		slowDrift: false,
	});

	const metaRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const node = metaRef.current as HTMLElement;

		node.appendChild(viewer.container);
	}, []);

	return (
		<div className={styles.WalletInteraction}>
			<div ref={metaRef}></div>
			<div>
				<h3>Confitm transaction + gas</h3>
				<div className={styles.Data}>
					<p>Type: </p>
					<label htmlFor="gas">
						<Checkbox name="transaction" id="gas" />
						<span>Signature (no gas)</span>
					</label>
					<label htmlFor="gas2">
						<Checkbox name="transaction" id="gas2" />
						<span>Transaction (gas)</span>
					</label>
				</div>
			</div>
			<div className={styles.ButtonGroup}>
				<button>Deny</button>
				<button>Approve</button>
			</div>
		</div>
	);
};

export default WalletInteraction;
