import React from 'react'

import { FutureButton, IconButton, TextButton, SearchBar, Image } from 'components'
import { useHistory } from 'react-router-dom'

import styles from './DomainTable.module.css'

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
    isGridView: boolean;
    isRootDomain: boolean;
    style?: React.CSSProperties;
}

const DomainTable: React.FC<DomainTableProps> = ({ domains, isGridView, isRootDomain, style }) => {

    const history = useHistory()

    // TODO:
    // Need to get each domain image

    const navigateTo = (domain: string) => {
        history.push(domain)
    }

    return (
        <div 
            style={style}
            className={styles.DomainTableContainer + ' border-primary border-rounded blur'}
        >
            <div className={styles.searchHeader}>
                <SearchBar style={{width: 884}} />
                <div className={styles.searchHeaderButtons}>
                    <IconButton toggleable={true} icon={list} style={{height: 32, width: 32}} />
                    <IconButton toggleable={true} icon={grid} style={{height: 32, width: 32}} />
                </div>
            </div>
            <table className={styles.DomainTable}>
                { domains.length > 0 && 
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
                                    <td className={styles.left}><div style={{display: 'flex'}}><Image style={{width: 36, height: 36, marginRight: 8}} src='' /><span>{d.domainName}</span> <span className={styles.ticker}>????</span></div></td>
                                    <td className={styles.center}>{`$${Number(d.lastBid.toFixed(2)).toLocaleString()}`}</td>
                                    <td className={styles.center}>{Number(d.numBids).toLocaleString()}</td>
                                    <td className={styles.center}>{`${Number(d.lastSalePrice.toFixed(2)).toLocaleString()} WILD`}</td>
                                    <td className={styles.center}><FutureButton onClick={() => console.log('trade', d)}>{`$${Number(d.tradePrice.toFixed(2)).toLocaleString()}`}</FutureButton></td>
                                </tr>
                            ) }
                        </tbody>
                    </>
                }
                { !domains.length &&
                    <div className={styles.Loading}><div></div></div>
                }
            </table>
        </div>
    )
}

export default DomainTable