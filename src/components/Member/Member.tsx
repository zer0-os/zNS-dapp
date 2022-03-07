//- React Imports
import React from 'react';

//- Style Imports
import styles from './Member.module.scss';

type MemberProps = {
	id: string;
	name?: string;
	image?: string;
	subtext?: string;
	showZna?: boolean;
	style?: React.CSSProperties;
};

export const TEST_ID = {
	CONTAINER: 'member-container',
	MEMBER_INFO: 'member-info',
	MEMBER_ID: 'member-id',
	MEMBER_TEXT: 'member-text',
	MEMBER_ZNA_BUTTON: 'member-zna-button',
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
			<div
				style={style}
				className={styles.Member}
				data-testid={TEST_ID.CONTAINER}
			>
				{/* <div className={styles.Image}>
					<Image
						onClick={() => console.warn('Member clicks not yet implemented')}
						src={image}
					/>
				</div> */}
				<div className={styles.Info} data-testid={TEST_ID.MEMBER_INFO}>
					{subtext && (
						<>
							<span
								className={styles.Subtext}
								data-testid={TEST_ID.MEMBER_TEXT}
							>
								{subtext}
							</span>
						</>
					)}
					<span data-testid={TEST_ID.MEMBER_ID}>
						<a
							href={'https://etherscan.io/address/' + id}
							className={'alt-link'}
							target="_blank"
							rel="noreferrer"
						>
							{id.substring(0, 4)}...{id.substring(id.length - 4)}
						</a>
					</span>
					{showZna && name && (
						<>
							<button
								className="text-button"
								data-testid={TEST_ID.MEMBER_ZNA_BUTTON}
							>
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
