// Pulls the IPFS hash from an IPFS url
// https://ipfs.fleek.co/ipfs/QmNr4mi2T4Qm5ErtnSdxA7a5nCPT2YkF5gAPnLm8oSCXY8
// or
// ipfs://QmNr4mi2T4Qm5ErtnSdxA7a5nCPT2YkF5gAPnLm8oSCXY8
// turns into
// QmNr4mi2T4Qm5ErtnSdxA7a5nCPT2YkF5gAPnLm8oSCXY8

export const getHashFromIPFSUrl = (url: string) => {
	if (url.startsWith('ipfs://')) {
		// ipfs://
		return url.slice(7);
	} else {
		// http(s)://
		const hashIndex = url.lastIndexOf('/') + 1;
		return url.slice(hashIndex);
	}
};
