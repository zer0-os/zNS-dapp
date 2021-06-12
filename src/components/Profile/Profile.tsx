//- React imports
import React from 'react';

//- Style Imports
import CopyInput from '../CopyInput/CopyInput.js';
import ProfileStyle from './Profile.module.css';

//- Component Imports
import { Image, RequestTable } from 'components';

//- Library Imports
import { randomName, randomImage } from 'lib/Random';
import useMvpVersion from 'lib/hooks/useMvpVersion';
import { useStakingController } from 'lib/hooks/useStakingController';
import {
	useRequestsMadeByAccount,
	useRequestsForOwnedDomains,
} from 'lib/hooks/useDomainRequestsSubgraph';

//- Mock
import mock from './mock.json';

type ProfileProps = {
	id: string;
	// TODO: Change yours
	yours?: boolean;
};

const Profile: React.FC<ProfileProps> = ({ id, yours }) => {
	const { mvpVersion } = useMvpVersion();

	const { requests } = useRequestsMadeByAccount(id);

	return (
		<div
			className={`${ProfileStyle.profile} blur border-primary border-rounded`}
		>
			{/* <h1 className={`glow-text-white`}>Profile</h1> */}
			<div className={ProfileStyle.body}>
				{/* Hide DP for now */}
				{mvpVersion === 3 && (
					<div>
						<div style={{ height: 160 }}>
							<Image className={ProfileStyle.dp} src={randomImage(id)} />
						</div>
						<span className={`${ProfileStyle.endpoint} glow-text-blue`}>
							0://wilder.{randomName(id).toLowerCase().split(' ').join('.')}
						</span>
					</div>
				)}

				<div>
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
							</p>{' '}
						</>
					)}
					<CopyInput value={id} />
				</div>
			</div>
			<RequestTable requests={mock} />
		</div>
	);
};

export default Profile;
