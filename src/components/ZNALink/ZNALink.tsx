import React from 'react'

import { Link, useLocation } from 'react-router-dom'

import styles from './ZNALink.module.css'

type ZNAProps = {
    domain: string;
}

const ZNALink: React.FC<ZNAProps> = ({ domain }) => {


    return (
        <div className={styles.ZNALink}>
            <Link style={{textDecoration: 'none', color: 'white'}} to={''}>wilder</Link>
            { domain.split('.').map((part, i) => {
                if(part === '/') return
                return i === 0 ?
                <Link key={i} style={{textDecoration: 'none', color: 'white'}} to={part}>.{ part.charAt(0) === '/' ? part.substring(1, part.length) : part }</Link>
                : 
                <Link key={i} style={{textDecoration: 'none', color: 'white'}} to={domain.split('.').slice(0, i + 1).join('.')}>{i > 0 ? `.${part}` : part}</Link>
            }
                
            ) }
        </div>
    )
}

export default ZNALink