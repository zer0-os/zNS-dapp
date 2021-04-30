import { useState, useCallback, useEffect } from 'react'

import styles from './Image.module.css'
// import placeholder from './'

const Image = (props: any) => {
    const [ loaded, setLoaded ] = useState(false)
    const load = () => setLoaded(true)
    const unload = () => setLoaded(false)

    // return (
    //     <>
    //         <img {...props} className={props.className + ' ' + styles.LazyImage} style={{...props.style}} onLoad={load} src={props.src} />
    //         { !loaded && <div {...props} className={props.className + ' ' + styles.Loading}><div className={`${styles.Spinner} ${loaded ? styles.Expand : ''}`}></div></div> }
    //     </>
    // )

    return (
        <div style={{...props.style}} className={styles.LazyImage}>
            <img {...props} onLoad={load} style={{...props.style, opacity: loaded ? 1 : 0}} className={`${props.className}`} />
            <div {...props} className={props.className + ' ' + styles.Indicator}><div className={styles.Spinner}></div></div>
        </div>
    )
}

export default Image