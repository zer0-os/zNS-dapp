/*
	This container...
	- gets the media that we need from IPFS
	- finds out what file type we are rendering
	- creates a Blob url to send to presentational layer 
		from data return from IPFS
*/

import { useState, useEffect } from 'react';

import { MediaContainerProps } from './types';

import IPFSMedia from './IPFSMedia';

const IPFSMediaContainer = (props: MediaContainerProps) => {
	// Destructure props
	const { className, style, alt, ipfsUrl } = props;

	// Setup some state
	const [isLoading, setIsLoading] = useState(true);

	return <></>;
};

export default IPFSMediaContainer;
