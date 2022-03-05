//- React imports
import React, { useState } from 'react';

//- Style Imports
import CopyInput from '../CopyInput/CopyInput.js';
import ProfileStyle from './Profile.module.scss';
import { TABS } from './Profile.constants';

//- Component Imports
import { TabBar } from 'components';
import { OwnedDomainsTable, BidTable } from 'containers';

type ProfileProps = {
	id: string;
	// TODO: Change yours
	yours?: boolean;
	onNavigate: (to: string) => void;
};

const Profile: React.FC<ProfileProps> = ({ id, yours, onNavigate }) => {
	//////////////////
	// Custom Hooks //
	//////////////////

	//////////////////
	// State / Data //
	//////////////////

	const [selected, setSelected] = useState(`Your Domains`); // Which tab is selected

	///////////////
	// Functions //
	///////////////

	const select = (option: string) => {
		setSelected(option);
	};

	const navigateToDomain = (domain: string) => {
		const d =
			domain.indexOf('wilder.') === 0 ? domain.split('wilder.')[1] : domain;
		if (onNavigate) onNavigate(d);
	};

	/////////////
	// Effects //
	/////////////

	////////////
	// Render //
	////////////

	if (!id) return <></>; // if user has disconnected wallet while profile is open

	return (
		<div
			className={`${ProfileStyle.profile} border-primary border-rounded background-primary`}
		>
			<h1 className={`glow-text-white`}>Profile</h1>
			<div className={ProfileStyle.body}>
				{/* Hide DP for now */}
				{/* <div className={ProfileStyle.First}>
					<div style={{ height: 160 }}>
						<Image className={ProfileStyle.dp} src={randomImage(id)} />
					</div>
					<span className={`${ProfileStyle.endpoint} glow-text-blue`}>
						0://wilder.{randomName(id).toLowerCase().split(' ').join('.')}
					</span>
				</div> */}

				<div className={ProfileStyle.Second}>
					{/* Hide profile data for now */}
					{/* <>
						<span className={`${ProfileStyle.name} glow-text-blue`}>
							{randomName(id)}
						</span>
						<p>
							Hey I’m {randomName(id)} and I like staring into the night sky and
							imagining myself in another galaxy. I’m so passionate about space
							travel that I spend the majority of my time making animated short
							films about it. With the magic of CGI, I can make worlds and
							journeys so real that I can almost taste the synthetic beef that
							comes out of the assembler!
							<br />
							<br />
							Join me on one or all of my journeys, I welcome you aboard!
						</p>
					</> */}
					<CopyInput value={id} />
				</div>
			</div>
			<TabBar tabs={[TABS.YOUR_DOMAINS, TABS.YOUR_BIDS]} onSelect={select} />
			{selected === TABS.YOUR_DOMAINS && (
				<OwnedDomainsTable onNavigate={navigateToDomain} />
			)}
			{selected === TABS.YOUR_BIDS && <BidTable />}
		</div>
	);
};

export default Profile;
