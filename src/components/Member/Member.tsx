//- React Imports
import React from 'react';

//- Component Imports
import { Image } from 'components';

//- Style Imports
import styles from './Member.module.css';

//- Library Imports
import useMvpVersion from 'lib/hooks/useMvpVersion';
import { randomName } from 'lib/Random';

type MemberProps = {
	id: string;
	name: string;
	image: string;
	subtext?: string;
	showZna?: boolean;
};

const Member: React.FC<MemberProps> = ({
	id,
	name,
	image,
	subtext,
	showZna,
}) => {
	const { mvpVersion } = useMvpVersion();

	return (
		<>
			{/* TODO: Remove overlay from child */}
			<div className={styles.Member}>
				{mvpVersion === 3 && (
					<div className={styles.Image}>
						<Image
							onClick={() => console.warn('Member clicks not yet implemented')}
							src={image}
						/>
					</div>
				)}
				<div className={styles.Info}>
					<span>
						<a
							href={'https://etherscan.io/address/' + id}
							className={'alt-link'}
							target="_blank"
							rel="noreferrer"
						>
							{mvpVersion === 3
								? id.indexOf('0x') === 0
									? randomName(id)
									: name
								: `${id.substring(0, 4)}...${id.substring(id.length - 4)}`}
						</a>
					</span>
					{subtext && (
						<>
							<br />
							<span>{subtext}</span>
						</>
					)}
					{showZna && (
						<>
							<br />
							<button className="text-button">
								0://wilder.{name.toLowerCase().split(' ').join('.')}
							</button>
						</>
					)}
				</div>
			</div>
		</>
	);
};

export default Member;
