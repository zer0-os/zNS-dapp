import React, { useState, useEffect } from 'react'

import styles from './Shop.module.css'

import TextButton from '../Buttons/TextButton/TextButton.js'
import NFTCard from '../Cards/NFTCard/NFTCard.js'

import NFTService from './nfts.js'

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

    const getSliderOffset = () => {
        // These are very hard coded right now - not great but it works for MVP
        if(selected === 'ownedBy') return {left: 0, width: 158}
        else if(selected === 'createdBy') return {left: 198, width: 197}
        else return {left: 435, width: 77}
    }

    return(
        <div className={styles.Shop}>
            <div className={styles.Sections}>
                <TextButton 
                    onClick={getOwnedBy}
                    selected={selected === 'ownedBy'}
                >NFTs You Own</TextButton>
                <TextButton
                    onClick={getCreatedBy}
                    selected={selected === 'createdBy'}
                >NFTs You've Made</TextButton>
                <TextButton
                    onClick={getOffers}
                    selected={selected === 'offers'}
                >Offers</TextButton>
                <div 
                    className={styles.Slider}
                    style={getSliderOffset()}
                >
                </div>
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