/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect, useMemo, useRef } from 'react';


//- Component Imports
// import {
// 	Artwork,
// 	SearchBar,
// 	IconButton,
// 	Member,
// 	FilterButton,
// 	FutureButton,
// 	OptionDropdown,
// 	Overlay,
// 	NFTCard,
// 	Spinner,
// 	Confirmation,
//     GenericTable
// } from 'components';
// import RequestActions from './components/RequestActions';
// import { Request } from 'containers';

// //- Library Imports
// import { getRequestData } from './data';
// import {
// 	useRequestsMadeByAccount,
// 	useRequestsForOwnedDomains,
// } from 'lib/hooks/useDomainRequestsSubgraph';
// import { ethers } from 'ethers';
// import { useStakingProvider } from 'lib/providers/StakingRequestProvider';

// //- Type Imports
// import { DomainRequestAndContents } from 'lib/types';

// //- Style Imports
// import styles from './RequestTable.module.css';

// //- Asset Imports

// import { useZnsContracts } from 'lib/contracts';
// import { useWeb3React } from '@web3-react/core';


type RequestTableProps = {
    style?: React.CSSProperties;
    userId: string;
    onNavigate: (domain: string) => void;
};

const RequestTable: React.FC<RequestTableProps> = ({
	style,
	userId,
	onNavigate,
})=>{



	//////////////////
	// Custom Hooks //
	//////////////////
	// const { account } = useWeb3React();
	// const staking = useStakingProvider();
	// const znsContracts = useZnsContracts()!;
	// const yourRequests = useRequestsMadeByAccount(userId);
	// const requestsForYou = useRequestsForOwnedDomains(userId);
	// const lootToken = znsContracts.lootToken;

	//////////////////
	// State / Refs //
	//////////////////

	// const containerRef = useRef<HTMLDivElement>(null);

	
	// const [isApproving, setIsApproving] = useState(false);
	// const [approvingText, setApprovingText] = useState(
	// 	'Please confirm transaction in wallet',
	// );
	// const [approveError, setApproveError] = useState<string | undefined>();
	// const [fulfillError, setFulfillError] = useState<string | undefined>();
	// // Searching
	// const [searchQuery, setSearchQuery] = useState('');
	// const [statusFilter, setStatusFilter] = useState('');
	// const [domainFilter, setDomainFilter] = useState('All Domains');

	// const [isLoading, setIsLoading] = useState(false); // Not needed anymore?

	// const [showLoadingIndicator, setShowLoadingIndicator] = useState(false);
	// The request we're viewing in the request modal
	// const [viewing, setViewing] = useState<
	// 	DomainRequestAndContents | undefined
	// >();

	// The Token that we need to approve the staking controller to transfer
	// const [approveTokenTransfer, setApproveTokenTransfer] = useState<
	// 	string | undefined
	// >();

	// The requests that we have loaded (pulled from chain and grabbed metadata from IFPS)
	// const [loadedRequests, setLoadedRequests] = useState<
	// 	DomainRequestAndContents[]
	// >([]);

	///////////////
	// Functions //
	///////////////

	

	// const setList = () => setIsGridView(false); // Opens list view
	// const setGrid = () => setIsGridView(true); // Opens grid view

	// const dateFromTimestamp = (timestamp: string) =>
	// 	new Date(Number(timestamp) * 1000).toLocaleString();

	// // Opens a request in the request modal
	// const view = (domainName: string) => {
	// 	if (loadedRequests) {
	// 		const r = loadedRequests?.filter(
	// 			(d) => d.request.domain === domainName,
	// 		)[0];
	// 		setViewing(r);
	// 	}
	// };

	/* Calls the middleware for approving a request
		 This is passed to the Request modal */
	// const onApprove = async (request: DomainRequestAndContents) => {
	// 	try {
	// 		await staking.approveRequest(request);
	// 		setViewing(undefined);
	// 	} catch (e) {
	// 		// Catch thrown when user rejects transaction
	// 		console.error(e);
	// 	}
	// };

	/**
	 * Creates Transaction to approve the Staking Controller to transfer
	 * tokens on behalf of the user.
	 */
	// const onApproveTokenTransfer = async () => {
	// 	setApproveError(undefined);
	// 	setIsApproving(true); //start loading indicator
	// 	try {
	// 		const approveTx = await lootToken.approve(
	// 			znsContracts.stakingController.address,
	// 			ethers.constants.MaxUint256,
	// 		);
	// 		setApprovingText('Waiting for transaction to complete');
	// 		await approveTx.wait();
	// 		setApproveTokenTransfer(undefined); //close modal
	// 	} catch (e) {
	// 		console.error(e);
	// 		//if user rejects transaction
	// 		if (e.code === 4001) {
	// 			setApproveError(`Rejected by wallet`);
	// 		} else {
	// 			setApproveError(`Failed to submit transaction.`);
	// 		}
	// 	}
	// 	setIsApproving(false); //stop loading indicator

	// 	setApprovingText('Please confirm transaction in wallet');
	// };

	// const onFulfill = async (request: DomainRequestAndContents) => {
	// 	setFulfillError(undefined);
	// 	const allowance = await lootToken.allowance(
	// 		account!,
	// 		znsContracts.stakingController.address,
	// 	);

	// 	if (allowance.lt(request.request.offeredAmount)) {
	// 		setApproveTokenTransfer(lootToken.address);
	// 		return;
	// 	}
	// 	setShowLoadingIndicator(true); //displays loading indicator on overlay
	// 	try {
	// 		await staking.fulfillRequest(request);
	// 		setViewing(undefined);
	// 	} catch (e) {
	// 		console.error(e);
	// 		//if user rejects transaction
	// 		if (
	// 			e.message ===
	// 			'Failed to fulfill request: undefined MetaMask Tx Signature: User denied transaction signature.'
	// 		) {
	// 			setFulfillError(`Rejected by wallet`);
	// 		} else {
	// 			setFulfillError(`Failed to submit transaction.`);
	// 		}
	// 	}

	// 	setShowLoadingIndicator(false);
	// };

	/* Sets some search parameters 
		 There's a hook listening to each of these variables */
	// const search = (query: string) => setSearchQuery(query);
	// const filterByStatus = (filter: string) => setStatusFilter(filter);
	// const filterByDomain = (filter: string) => setDomainFilter(filter);

	/////////////
	// Effects //
	/////////////

	// Refresh data 5 seconds after a request is approved
	// This is hopefully enough time for the subgraph to update
	// React.useEffect(() => {
	// 	let isSubscribed = true;
	// 	setTimeout(() => {
	// 		if (isSubscribed) {
	// 			requestsForYou.refresh();
	// 		}
	// 	}, 5000);

	// 	return () => {
	// 		isSubscribed = false;
	// 	};
	// }, [staking.approved]);

return(<></>
/* <GenericTable
  alignment={[0,1,1,1,1,1,0]}
  headers={['', 'CREATOR', 'ARTWORK INFO', 'REQUEST DATE', 'STAKED TOKENS', 'STATUS','']}

/> */
)
}

export default RequestTable

