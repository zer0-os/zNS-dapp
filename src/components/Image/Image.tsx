import { useState, useCallback, useEffect } from 'react'

import styles from './Image.module.css'
// import placeholder from './'

const Image = (props: any) => {
    const [ loaded, setLoaded ] = useState(false)
    const load = () => setLoaded(true)
    const unload = () => setLoaded(false)


    //TODO: Add Fade in

    return (
        <div style={{position: 'relative', width: '100%' }}>
            <img {...props} className={`${props.className ? props.className : ''} ${styles.Image}`} style={{opacity: loaded ? 1 : 0, objectFit: 'cover', ...props.style}} onLoad={load} src={props.src} />
            { !loaded && <div {...props} className={styles.Loading}><div className={styles.Spinner}></div></div> }
        </div>
    )
}

export default Image