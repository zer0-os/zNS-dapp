import React, { useState, useEffect, useMemo, useRef } from 'react'
import { useHistory } from 'react-router-dom'

//- Component Imports
import { 
    FutureButton, 
    IconButton, 
    TextButton, 
    SearchBar, 
    Image, 
    NFTCard 
} from 'components'

//- Library Imports
import StaticEmulator from 'lib/StaticEmulator/StaticEmulator.js';

//- Style Imports
import styles from './DomainTable.module.css'

//- Asset Imports
import TemplateAsset from './assets/wilder.jpg'
import graph from './assets/graph.svg'
import grid from './assets/grid.svg'
import list from './assets/list.svg'

//- IPFS Config
// TODO: Move IPFS client to a separate
// TODO: ipfs-api is deprecated - upgrade to ipfs-http-client
const ipfsLib = require('ipfs-api');
const ipfsClient = new ipfsLib({
  host: 'ipfs.infura.io',
  port: 5001,
  protocol: 'https',
});

// TODO: Table code is looking a bit messy - maybe rewrite

type DomainTableData = {
    domainId: string;
    domainName: string;
    domainMetadataUri: string;
    image?: string;
    name?: string;
    description?: string;
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
    mvpVersion: number;
}

const DomainTable: React.FC<DomainTableProps> = ({ domains, isRootDomain, style, empty, mvpVersion }) => {

    //- Page State
    const [ isGridView, setIsGridView ] = useState(false)
    const [ isLoading, setIsLoading ] = useState(true)
    const [ hasMetadataLoaded, setHasMetadataLoaded ] = useState(false)
    const [ imageCount, setImageCount ] = useState(0)
    const [ containerHeight, setContainerHeight ] = useState(0)

    //- Refs
    const containerRef = useRef<HTMLDivElement>(null)

    //- Functions
    const navigateTo = (domain: string) => history.push(domain)

    //- Hooks
    const history = useHistory()

    // Gets metadata for each image in domain list
    useEffect(() => {
        setHasMetadataLoaded(false)
        var count = 0, completed = 0
        for(var i = 0; i < domains.length; i++) {
            const domain = domains[i]
            if(!domain.image && domain.domainMetadataUri) {
                count++ // This is a total of how many images don't have metadata loaded in
                ipfsClient.cat(domain.domainMetadataUri.slice(21)).then((d: any) => {
                    const data = JSON.parse(d)
                    domain.image = data.image
                    domain.name = data.title
                    domain.description = data.description
                    // If we have received all metadata for images that need it
                    if(++completed === count) setHasMetadataLoaded(true)
                })
            }
        }
    }, [ domains ])

    useEffect(() => {
        if(!isLoading) {
            const el = containerRef.current
            if(el) {
                setContainerHeight(isGridView ? el.clientHeight + 30 : el.clientHeight)
            }
        } else {
            setContainerHeight(0)
        }
    }, [ isLoading, isGridView ])

    /* Domain metadata is coming in asynchronously, so we need to
       update the rows as the data comes in */
    const tableData: DomainTableData[] = useMemo(() => {
        domains.length ? setIsLoading(false) : setIsLoading(true)
        return domains
    }, [ hasMetadataLoaded ])

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
                <div className={styles.Container} ref={containerRef}>
                    {/* Table List View */}
                    { tableData.length > 0 && !isGridView && !isLoading &&
                        <table className={styles.DomainTable}>
                            <>
                                <thead>
                                    <tr>
                                        <th className={styles.left}></th>
                                        <th className={styles.left}>Name</th>
                                        { mvpVersion === 3 && <th className={styles.center}>Last Bid</th> }
                                        { mvpVersion === 3 && <th className={styles.center}>No. Of Bids</th> }
                                        { mvpVersion === 3 && <th className={styles.center}>Last Sale Price</th> }
                                        <th className={styles.center}>Trade</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    { tableData.map((d, i) =>
                                        <tr onClick={() => navigateTo(d.domainName)} key={i}>
                                            <td className={styles.left}>{i + 1}</td>
                                            {/* TODO: Div can not be a child of table */}
                                            <td className={styles.left}>
                                                <div style={{display: 'flex', alignItems: 'center'}}>
                                                    <Image 
                                                        style={{width: 56, height: 56, marginRight: 8, marginTop: -4, borderRadius: isRootDomain ? '50%' : 'calc(var(--box-radius)/2)', objectFit: 'cover'}} 
                                                        src={d.image ? d.image : ''}
                                                    />
                                                    <span>{d.domainName.split('.')[d.domainName.split('.').length - 1]}</span>
                                                    <span style={{paddingLeft: 6}} className={styles.ticker}>{d.domainName.substring(0, 4).toUpperCase()}</span>
                                                </div>
                                            </td>
                                            { mvpVersion === 3 && <td className={styles.center}>{`$${Number(d.lastBid.toFixed(2)).toLocaleString()}`}</td> }
                                            { mvpVersion === 3 && <td className={styles.center}>{Number(d.numBids).toLocaleString()}</td> }
                                            { mvpVersion === 3 && <td className={styles.center}>{`${Number(d.lastSalePrice.toFixed(2)).toLocaleString()} WILD`}</td> }
                                            <td className={styles.center}><FutureButton glow onClick={() => console.log('trade', d)}>{mvpVersion === 3 ? `$${Number(d.tradePrice.toFixed(2)).toLocaleString()}` : 'ENLIST'}</FutureButton></td>
                                        </tr>
                                    ) }
                                </tbody>
                            </>
                        </table>
                    }   

                    {/* Table Grid View */}
                    { tableData.length > 0 && isGridView && !isLoading &&
                        <ol className={styles.Grid}>
                            { tableData.map((d, i) => 
                                <li onClick={() => navigateTo(d.domainName)} key={i}>
                                    <NFTCard
                                        name={d.domainName.split('.')[d.domainName.split('.').length - 1]}
                                        imageUri={d.image ? d.image : ''}
                                        price={d.tradePrice}
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

                {/* Table Placeholders
                { isLoading && !empty &&
                    <div className={styles.Loading}><div></div></div>
                }
                {  empty &&
                    <div className={styles.Empty}><span>This NFT has no children!</span></div> 
                } */}
                </div>

                <div style={{height: containerHeight}} className={styles.Expander}></div>
            </div>
            

            
        </div>
    )
}

export default DomainTable