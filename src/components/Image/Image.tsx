import { useState } from 'react';

import styles from './Image.module.css';
// import placeholder from './'

// @TODO: Refactor props to not by 'any' type
const Image = (props: any) => {
	const [loaded, setLoaded] = useState(false);
	const load = () => setLoaded(true);

	return (
		<div style={{ position: 'relative', width: '100%', height: '100%' }}>
			<img
				{...props}
				className={`${props.className ? props.className : ''} ${styles.Image}`}
				style={{ opacity: loaded ? 1 : 0, objectFit: 'cover', ...props.style }}
				onLoad={load}
				src={props.src}
				alt={props.alt || ''}
			/>
			{!loaded && (
				<div {...props} className={styles.Loading}>
					<div className={styles.Spinner}></div>
				</div>
			)}
		</div>
	);
};

export default Image;
