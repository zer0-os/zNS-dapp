//- React Imports
import React from 'react'
import { Link } from 'react-router-dom'

//- Component Imports
import { Image } from 'components'


//- Hook Imports
import useMint from 'lib/hooks/useMint'

//- Style Imports 
import styles from './MintPreview.module.css'


const MintPreview = () => {

    const { minting, minted } = useMint()

    const nft = (nft: any, minted: boolean) => (
        <>
            <hr className='glow' />
            <li key={`${nft.name}${Math.random()}`}>
                <div className={`${styles.Image} border-rounded`}>
                    <Image src={`data:image/png;base64,${nft.image.toString('base64')}`} />
                </div>
                <div className={styles.Info}>
                    <h5 className='glow-text-blue'>{ nft.name }</h5>
                    
                    { minted && 
                        <Link
                            to={nft.domain.substring(1) + nft.name}
                        >
                            { nft.domain.length === 1 ? 'wilder.' : `wilder.${nft.domain.substring(1)}` }{ nft.name }
                        </Link>
                    }

                    { !minted &&
                        <a style={{color: 'var(--color-grey)'}}>
                            { nft.domain.length === 1 ? 'wilder.' : `wilder.${nft.domain.substring(1)}` }{ nft.name }
                        </a>
                    }
                    
                    <p>{ nft.story }</p>
                    { minted && <p style={{color: 'var(--color-success)'}}>Minting completed!</p> }
                    { !minted && <p>Minting...<br/>appx 3 minutes remaining</p> }
                </div>
            </li>
        </>
    )

    return (
        <ul className={`${styles.MintPreview} border-primary border-rounded blur`}>
            <h4 className='glow-text-white'>Minting</h4>
            { minting.map((n: any) => nft(n, false)) }
            { minted.map((n: any) => nft(n, true)) }
        </ul>
    )
}

export default MintPreview