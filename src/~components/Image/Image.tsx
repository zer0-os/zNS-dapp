import { useState, useCallback, useEffect } from 'react'

import styles from './Image.module.css'
// import placeholder from './'

const Image = (props: any) => {
    const [ loaded, setLoaded ] = useState(false)
    const load = () => setLoaded(true)
    const unload = () => setLoaded(false)

    return (
        <>
            <img {...props} className={props.className + ' ' + styles.LazyImage} style={{...props.style, display: loaded ? 'inherit' : 'none'}} onLoad={load} src={props.src} />
            { !loaded && <div {...props} className={props.className + ' ' + styles.Loading}><div className={styles.Spinner}></div></div> }
        </>
    )
}

export default Image