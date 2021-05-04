import React, { useState } from 'react'

import styles from './Shop.module.css'

import { TextButton, NFTCard } from 'components'

import NFTService from 'services/nfts.js'


const Shop = (props) => {

    const loggedInAs = 'Frank Wilder'
    const [ NFTs, setNFTs ] = useState(NFTService.getOwnedBy(loggedInAs))
    const [ selected, setSelected ] = useState('ownedBy')

    const getOwnedBy = () => {
        setNFTs(NFTService.getOwnedBy(loggedInAs))
        setSelected('ownedBy')
    }

    const getCreatedBy = () => {
        setNFTs(NFTService.getCreatedBy(loggedInAs))
        setSelected('createdBy')
    }

    const getOffers = () => {
        setNFTs([])
        setSelected('offers')
    }

    const selectedCss = {
        borderBottom: '1px solid #E0BAFF',
        fontWeight: 400,
    }

    const defaultCss = {
        fontWeight: 400,
        color: 'white'
    }

    return(
        <div className={styles.Shop}>
            <div className={styles.Sections}>
                <TextButton 
                    onClick={getOwnedBy}
                    selected={selected === 'ownedBy'}
                    style={selected === 'ownedBy' ? selectedCss : defaultCss}
                >NFTs You Own</TextButton>
                <TextButton
                    onClick={getCreatedBy}
                    selected={selected === 'createdBy'}
                    style={selected === 'createdBy' ? selectedCss : defaultCss}
                >NFTs You've Made</TextButton>
                <TextButton
                    onClick={getOffers}
                    selected={selected === 'offers'}
                    style={selected === 'offers' ? selectedCss : defaultCss}
                >Offers</TextButton>
                {/* <TextButton toggleable={true}>Offers</TextButton> */}
            </div>
            <ul>
                { NFTs.map(n => 
                    <li key={n.name}>
                    <NFTCard 
                        NFT={n} 
                        showCreator={selected !== 'createdBy'}
                        showOwner={selected !== 'ownedBy'}
                    />
                    </li>
                ) }
            </ul>
        </div>
    )
}

export default Shop