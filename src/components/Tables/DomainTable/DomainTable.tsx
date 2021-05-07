import React, { useState } from 'react'
import { useHistory } from 'react-router-dom'

//- Component Imports
import { FutureButton, IconButton, TextButton, SearchBar, Image, NFTCard } from 'components'

//- Style Imports
import styles from './DomainTable.module.css'

//- Asset Imports
import TemplateAsset from './assets/wilder.jpg'
import graph from './assets/graph.svg'
import grid from './assets/grid.svg'
import list from './assets/list.svg'

type DomainTableData = {
    domainId: string;
    domainName: string;
    domainMetadataUri: string;
    lastBid: number;
    numBids: number;
    lastSalePrice: number;
    tradePrice: number;
}

type DomainTableProps = {
    domains: DomainTableData[];
    isRootDomain: boolean;
    style?: React.CSSProperties;
    empty?: boolean;
}

const DomainTable: React.FC<DomainTableProps> = ({ domains, isRootDomain, style, empty }) => {

    const [ isGridView, setIsGridView ] = useState(false)

    const history = useHistory()

    // TODO: Get each domain image

    const navigateTo = (domain: string) => {
        history.push(domain)
    }

    return (
        <div 
            style={style}
            className={styles.DomainTableContainer + ' border-primary border-rounded blur'}
        >
            {/* Table Header */}
            <div className={styles.searchHeader}>
                <SearchBar style={{width: '100%', marginRight: 16}} />
                <div className={styles.searchHeaderButtons}>
                    <IconButton onClick={() => setIsGridView(false)} toggled={!isGridView} iconUri={list} style={{height: 32, width: 32}} />
                    <IconButton onClick={() => setIsGridView(true)} toggled={isGridView} iconUri={grid} style={{height: 32, width: 32}} />
                </div>
            </div>

            {/* Table Body */}
            <div className={styles.DomainTable}>
                {/* Table List View */}
                { domains.length > 0 && !isGridView && 
                    <table className={styles.DomainTable}>
                        <>
                            <thead>
                                <tr>
                                    <th className={styles.left}>#</th>
                                    <th className={styles.left}>Domain Name</th>
                                    <th className={styles.center}>Last Bid</th>
                                    <th className={styles.center}>No. Of Bids</th>
                                    <th className={styles.center}>Last Sale Price</th>
                                    <th className={styles.center}>Trade</th>
                                </tr>
                            </thead>
                            <tbody>
                                { domains.map((d, i) =>
                                    <tr onClick={() => navigateTo(d.domainName)} key={i}>
                                        <td className={styles.left}>{i + 1}</td>
                                        {/* TODO: Div can not be a child of table */}
                                        <td className={styles.left}><div style={{display: 'flex', alignItems: 'center'}}><Image style={{width: 36, height: 36, marginRight: 8, marginTop: -4}} src='' /><span>{d.domainName.split('.')[d.domainName.split('.').length - 1]}</span> <span style={{paddingLeft: 6}} className={styles.ticker}>{d.domainName.substring(0, 4).toUpperCase()}</span></div></td>
                                        <td className={styles.center}>{`$${Number(d.lastBid.toFixed(2)).toLocaleString()}`}</td>
                                        <td className={styles.center}>{Number(d.numBids).toLocaleString()}</td>
                                        <td className={styles.center}>{`${Number(d.lastSalePrice.toFixed(2)).toLocaleString()} WILD`}</td>
                                        <td className={styles.center}><FutureButton glow onClick={() => console.log('trade', d)}>{`$${Number(d.tradePrice.toFixed(2)).toLocaleString()}`}</FutureButton></td>
                                    </tr>
                                ) }
                            </tbody>
                        </>
                    </table>
                }   

                {/* Table Grid View */}
                { domains.length > 0 && isGridView &&
                    <ol className={styles.Grid}>
                        { domains.map((d, i) => 
                            <li onClick={() => navigateTo(d.domainName)} key={i}>
                                <NFTCard
                                    name={d.domainName.split('.')[d.domainName.split('.').length - 1]}
                                    imageUri={'assets/nft/greener.png'}
                                    price={2510}
                                    nftOwnerId={'Owner Name'}
                                    nftMinterId={'Minter Name'}
                                    showCreator={true}
                                    showOwner={true}
                                />
                            </li>
                        )
                        }
                    </ol>
                }

                {/* Table Placeholders */}
                { !domains.length && !empty &&
                    <div className={styles.Loading}><div></div></div>
                }
                {  empty &&
                    <div className={styles.Empty}><span>This NFT has no children!</span></div> 
                }
            </div>
            

            
        </div>
    )
}

export default DomainTable