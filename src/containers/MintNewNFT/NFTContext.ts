import React from 'react'

export interface NFTContextData {
	name: string;
	setName: (name: string) => void;
	ticker: string;
	setTicker: (ticker: string) => void;
	story: string;
	setStory: (story: string) => void;
	image: Buffer;
	setImage: (image: Buffer) => void;
	dynamic: boolean;
	setDynamic: (dynamic: boolean) => void;
}

export const NFTContextDataDefault: NFTContextData = {
    name: '',
    setName: () => {},
    ticker: '',
    setTicker: () => {},
    story: '',
    setStory: () => {},
    image: Buffer.from(''),
    setImage: () => {},
    dynamic: false,
    setDynamic: () => {},
}

export const NFTContext = React.createContext<NFTContextData>(NFTContextDataDefault);
