import React from 'react'

import {
    TextInput,
    FutureButton
} from 'components'

import styles from './Enlist.module.css'

const Enlist = (props) => {
    return (
		<div className={`${styles.Enlist} blur border-rounded border-primary`}>
			<div className={styles.Header}>
				<h1 className={`glow-text-white`}>Mint A New NFT</h1>
				<div>
					<h2 className={`glow-text-white`}>0:/Wilder.NewNFT</h2>
					<span>By Frank Wilder</span>
				</div>
			</div>
			
            <form className={styles.Section}>
                <div style={{display: 'flex'}}>
                    <div 
                        className={`${styles.NFT} border-rounded border-blue`}
                        // Template background for now
                        style={{backgroundImage: `url(assets/nft/redpill.png)`}}
                    >
                    </div>
                    <div className={styles.Inputs}>
                        <TextInput 
                            placeholder={'NFT Name'}
                        />
                        <TextInput 
                            style={{width: 145}}
                            placeholder={'Ticker'}	
                        />
                    </div>
                </div>
                <TextInput 
                    multiline={true} 
                    placeholder={'Story (400 characters max)'} 
                    style={{height: 200, marginTop: 40}} 
                />
            </form>
            <FutureButton 
                style={{margin: '40px auto 0 auto'}}
            >Continue</FutureButton>
		</div>
	)
}

export default Enlist