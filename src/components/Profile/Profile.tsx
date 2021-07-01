//- React imports
import React, { useState, useEffect } from 'react';

//- Style Imports
import CopyInput from '../CopyInput/CopyInput.js';
import ProfileStyle from './Profile.module.css';

//- Component Imports
import { Image, RequestTable, TextButton } from 'components';

//- Library Imports
import { randomName, randomImage } from 'lib/Random';
import useMvpVersion from 'lib/hooks/useMvpVersion';
import {
	useRequestsMadeByAccount,
	useRequestsForOwnedDomains,
} from 'lib/hooks/useDomainRequestsSubgraph';
import { useStakingProvider } from 'lib/providers/StakingRequestProvider';

//- Type Imports
import {
	DomainRequest,
	DomainRequestAndContents,
	DomainRequestContents,
} from 'lib/types';

type ProfileProps = {
	id: string;
	// TODO: Change yours
	yours?: boolean;
};

const Profile: React.FC<ProfileProps> = ({ id, yours }) => {
	//////////////////
	// Custom Hooks //
	//////////////////

	const { mvpVersion } = useMvpVersion();

	const staking = useStakingProvider();

	//////////////////
	// State / Data //
	//////////////////

	const yourRequests = useRequestsMadeByAccount(id);
	const requestsForYou = useRequestsForOwnedDomains(id);
	const [requestData, setRequestData] = useState<DomainRequestAndContents[]>(
		[],
	);

	const [selected, setSelected] = useState('requestsFor'); // Which tab is selected

	////////////
	// Styles //
	////////////

	// @TODO Move these out to the style module
	const selectedCss = {
		borderBottom: '1px solid #E0BAFF',
		marginBottom: '-1px',
		fontWeight: 400,
	};

	const defaultCss = {
		borderBottom: '1px solid transparent',
		marginBottom: '-1px',
		fontWeight: 400,
		color: 'white',
	};

	///////////////
	// Functions //
	///////////////

	const requestsBy = () => {
		setSelected('requestsBy');
	};
	const requestsFor = () => {
		setSelected('requestsFor');
	};

	/////////////
	// Effects //
	/////////////

	// Refresh data 5 seconds after a request is approved
	// This is hopefully enough time for the subgraph to update
	React.useEffect(() => {
		let isSubscribed = true;
		setTimeout(() => {
			if (isSubscribed) {
				yourRequests.refresh();
				requestsForYou.refresh();
			}
		}, 5000);

		return () => {
			isSubscribed = false;
		};
	}, [staking.approved, yourRequests, requestsForYou]);

	// Get all requests data from IPFS and hooks
	useEffect(() => {
		setRequestData([]); // Empty the request table between loads

		let requests: DomainRequest[];
		if (selected === 'requestsBy') {
			requests = yourRequests.requests?.domainRequests || [];
		} else {
			const r = requestsForYou.requests?.domains.map((d) => d.requests);
			if (r && r.length) requests = r.reduce((a, b) => a.concat(b));
			else requests = [];
		}

		if (!requests) return;

		if (!requests.length) {
			setRequestData([]);
		}

		if (requests.length) {
			// Store Request Contents data
			const data: DomainRequestAndContents[] = [];
			// Get request contents from IPFS
			const requestsToFetch = requests.filter((d) => d.requestUri);

			let finishedCount = 0;
			for (let i = 0; i < requestsToFetch.length; i++) {
				// eslint-disable-next-line no-loop-func
				const doFetch = async () => {
					const request = requestsToFetch[i];
					try {
						const res = await fetch(request.requestUri);
						const contents: DomainRequestContents = await res.json();
						const display: DomainRequestAndContents = {
							contents,
							request,
						};
						data.push(display);
					} catch (e) {
						console.error(
							`Failed to fetch domain request contents for request id: ${request.domain} `,
						);
						console.debug(e);
					}

					++finishedCount;

					if (finishedCount === requestsToFetch.length) {
						setRequestData(data);
					}
				};

				doFetch();
			}
		}
	}, [selected, yourRequests.requests, requestsForYou.requests]);

	return (
		<div
			className={`${ProfileStyle.profile} blur border-primary border-rounded`}
		>
			<h1 className={`glow-text-white`}>Profile</h1>
			<div className={ProfileStyle.body}>
				{/* Hide DP for now */}
				{mvpVersion === 3 && (
					<div className={ProfileStyle.First}>
						<div style={{ height: 160 }}>
							<Image className={ProfileStyle.dp} src={randomImage(id)} />
						</div>
						<span className={`${ProfileStyle.endpoint} glow-text-blue`}>
							0://wilder.{randomName(id).toLowerCase().split(' ').join('.')}
						</span>
					</div>
				)}

				<div className={ProfileStyle.Second}>
					{/* Hide profile data for now */}
					{mvpVersion === 3 && (
						<>
							<span className={`${ProfileStyle.name} glow-text-blue`}>
								{randomName(id)}
							</span>
							<p>
								Hey I’m {randomName(id)} and I like staring into the night sky
								and imagining myself in another galaxy. I’m so passionate about
								space travel that I spend the majority of my time making
								animated short films about it. With the magic of CGI, I can make
								worlds and journeys so real that I can almost taste the
								synthetic beef that comes out of the assembler!
								<br />
								<br />
								Join me on one or all of my journeys, I welcome you aboard!
							</p>
						</>
					)}
					<CopyInput value={id} />
				</div>
			</div>
			<div className={ProfileStyle.Sections}>
				<TextButton
					onClick={requestsFor}
					selected={selected === 'requestsFor'}
					style={selected === 'requestsFor' ? selectedCss : defaultCss}
				>
					Offers Made To You
				</TextButton>
				<TextButton
					onClick={requestsBy}
					selected={selected === 'requestsBy'}
					style={selected === 'requestsBy' ? selectedCss : defaultCss}
				>
					Offers You've Made
				</TextButton>
				{/* <TextButton toggleable={true}>Offers</TextButton> */}
			</div>
			<RequestTable yours={selected === 'requestsBy'} requests={requestData} />
		</div>
	);
};

export default Profile;
