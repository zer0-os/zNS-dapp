//- React Imports
import React from 'react';

//- Style Imports
import styles from './Member.module.css';

type MemberProps = {
	id: string;
	name: string;
	image: string;
	subtext?: string;
	showZna?: boolean;
	style?: React.CSSProperties;
};

const Member: React.FC<MemberProps> = ({
	id,
	name,
	image,
	subtext,
	showZna,
	style,
}) => {
	return (
		<>
			{/* TODO: Remove overlay from child */}
			<div style={style} className={styles.Member}>
				{/* <div className={styles.Image}>
					<Image
						onClick={() => console.warn('Member clicks not yet implemented')}
						src={image}
					/>
				</div> */}
				<div className={styles.Info}>
					<span>
						<a
							href={'https://etherscan.io/address/' + id}
							className={'alt-link'}
							target="_blank"
							rel="noreferrer"
						>
							{id.substring(0, 4)}...{id.substring(id.length - 4)}
						</a>
					</span>
					{subtext && (
						<>
							<span>{subtext}</span>
						</>
					)}
					{showZna && (
						<>
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
