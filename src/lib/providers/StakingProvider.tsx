import { useZnsContracts } from 'lib/contracts';
import useNotification from 'lib/hooks/useNotification';

export const StakingContext = React.createContext({
	request: (domainRequest: DomainRequest) => {},
});

type StakingProviderType = {
	children: React.ReactNode;
};

type DomainRequest = {
	requestor: string;
	parent: string; // parent domain id
	domain: string; // domain label
	stakeAmount: string;
};

const StakingProvider: React.FC<StakingProviderType> = ({ children }) => {
	const { addNotification } = useNotification();
	const stakingController = useZnsContracts()?.stakingController;

	const request = (domainRequest: DomainRequest) => {
		if (stakingController) {
			console.error(`no controller`);
			return;
		}

		const userHasSubmitted = new Promise<void>((resolve, reject) => {
			const doRequest = async () => {
				try {
				} catch (e) {
					if (e.message || e.data) {
						console.error(`failed to mint: ${e.data} : ${e.message}`);
					}
					console.error(e);

					addNotification(
						'Encountered an error while attempting to request a domain.',
					);

					reject();
				}
			};

			doRequest();
		});
	};

	const contextValue = {
		request,
	};

	return (
		<StakingContext.Provider value={contextValue}>
			{children}
		</StakingContext.Provider>
	);
};
