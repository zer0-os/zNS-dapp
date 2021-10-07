import React from 'react'


export const BidContext = React.createContext({

	makeABid: (domain: Domain) => {
		return;
	},
	close: () => {
		return;
	},
	bidPlaced: () => {
		return;
	},
	
});

type BidProviderType = {
	children: React.ReactNode;
};

const OwnedDomainTableProvider: React.FC<BidProviderType> = ({ children }) => {
	//////////////////////////
	// Hooks & State & Data //
	//////////////////////////

	const [biddingOn, setBiddingOn] = useState<Maybe<Domain>>();
	const [updated, setUpdated] = useState<Maybe<Domain>>();

	const makeABid = (domain: Domain) => {
		setBiddingOn(domain);
	};

	const close = () => {
		setBiddingOn(undefined);
	};

	const bidPlaced = () => {
		setUpdated(biddingOn);
		setBiddingOn(undefined);

		// This is a bad solution long term
		setTimeout(() => {
			setUpdated(undefined);
		}, 1000);
	};

	const contextValue = {
		domain: biddingOn,
		makeABid,
		close,
		bidPlaced,
		updated,
	};

	return (
		<BidContext.Provider value={contextValue}>{children}</BidContext.Provider>
	);
};

export default OwnedDomainTableProvider;

export function useTableProvider() {
	const { bidPlaced, makeABid, close } =
		React.useContext(BidContext);
	return { bidPlaced, makeABid, close };
}
