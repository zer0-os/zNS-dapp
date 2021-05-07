//- React Imports
import React, { useState, useRef, useContext } from 'react'

import { NFTContext } from '../NFTContext'

//- Style Imports
import styles from '../MintNewNFT.module.css'

//- Component Imports
import { ValidatedInput, StepBar, ToggleSection, TextInput, FutureButton } from 'components'

type TokenInformationProps = {
    onContinue: () => void;
}

const TokenInformation: React.FC<TokenInformationProps> = ({ onContinue }) => { 

    //- NFT Data
    const { name, setName, ticker, setTicker, story, setStory, image, setImage } = useContext(NFTContext)
    const [ nftImage, setNftImage ] = useState('') // Local image for image preview

    //- Page data
    const [ errors, setErrors ] = useState<string[]>([])

    //- Image Upload Handling
	// TODO: Split image uploads into a new component
	const inputFile = useRef<HTMLInputElement>(null)
	const openUploadDialog = () => inputFile.current ? inputFile.current.click() : null
	const onImageChanged = (event: React.ChangeEvent<HTMLInputElement>) => {
		if (event.target.files && event.target.files[0]) {
            // Raw data for image preview
			const reader = new FileReader();
			reader.onload = (e: any) => e.target ? setNftImage(e.target?.result) : alert('File upload failed, please try again!')
			reader.readAsDataURL(event.target.files[0]);

            // Uint8Array data for sending to IPFS
			const bufferReader = new FileReader();
			bufferReader.readAsArrayBuffer(event.target.files[0]);
			bufferReader.onloadend = () => setImage(Buffer.from(bufferReader.result as ArrayBuffer))
		}
	}

    const pressContinue = () => {
        // Do some validation
        const errors: string[] = []
        if(!name.length) errors.push('name')
        if(ticker.length < 4) errors.push('ticker')
        if(!story.length) errors.push('story')
        if(!image.length) errors.push('image')
        setErrors(errors)
        if(!errors.length) onContinue()
    }

    return(
        <>
            <form className={styles.Section}>
                <div style={{display: 'flex'}}>
                    <div 
                        onClick={openUploadDialog}
                        className={`${styles.NFT} border-rounded border-blue`}
                        style={{borderColor: errors.includes('image') ? 'red' : ''}}
                    >
                        { !nftImage && 
                            <span className='glow-text-white'>Choose an Image</span>
                        }
                        { nftImage && 
                            <img
                                src={nftImage as string}
                                // onChange={onImageChanged}
                                // style={{ display: nftImage ? 'inline-block' : 'none' }}
                            />
                        }
                    </div>
                    <input
                        style={{display: 'none'}}
                        accept="image/*"
                        multiple={false}
                        name={'image'}
                        type="file"
                        onChange={onImageChanged}
                        ref={inputFile}
                    ></input>
                    <div className={styles.Inputs}>
                        <TextInput 
                            placeholder={'NFT Name'}
                            onChange={(name: string) => setName(name)}
                            text={name}
                            error={errors.includes('name')}
                        />
                        <TextInput 
                            style={{width: 145}}
                            placeholder={'Ticker'}
                            onChange={(ticker: string) => setTicker(ticker.length > 4 ? ticker.substring(0, 4).toUpperCase() : ticker.toUpperCase())}
                            text={ticker}
                            error={errors.includes('ticker')}
                        />
                    </div>
                </div>
                <TextInput 
                    multiline={true} 
                    placeholder={'Story (400 characters max)'} 
                    style={{height: 200, marginTop: 40}}
                    onChange={(story: string) => setStory(story)}
                    text={story}
                    error={errors.includes('story')}
                />
            </form>
            <FutureButton 
                style={{margin: '0 auto 0 auto', height: 36, borderRadius: 18}}
                onClick={pressContinue}
                glow
            >Continue</FutureButton>
        </>
    )
}

export default TokenInformation