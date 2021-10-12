/* eslint-disable react-hooks/exhaustive-deps */
import { Artwork, FutureButton, Spinner, Member } from 'components';
import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';
import styles from './RequestTableRow.module.css';
import  {useTableProvider} from './RequestTableProvider'

const RequestTableRow = (props: any) => {
	const dateFromTimestamp = (timestamp: string) =>
		new Date(Number(timestamp) * 1000).toLocaleString();

	const { contents, request } = props.data;
	const {view} = useTableProvider()

	return (
		<>
			<tr onClick={() => view(request.domain)} className={styles.Rows}>
				<td>{props.rowNumber + 1}</td>
				<td>
					<Member id={request.requestor.id} name={''} image={''} />
				</td>

				<td>
					<Artwork
						id={request.domain}
						domain={request.domain ? `0://${request.domain}` : ''}
						disableInteraction
						metadataUrl={contents.metadata}
						style={{ maxWidth: 200 }}
						pending
					/>
				</td>
				<td>
					<div className={styles.left}>
						{dateFromTimestamp(request.timestamp).split(',')[0]}
					</div>
				</td>
				<td>
					<div className={styles.right}>
						{Number(
							ethers.utils.formatEther(request.offeredAmount),
						).toLocaleString()}{' '}
						LOOT
					</div>
				</td>

				<td>
					<div className={styles.center}>
						{/* Fulfilled domain request */}
						{request.fulfilled && (
							<div className={styles.Accepted}>
								<span>Fulfilled</span>
								<br />
								<span>{dateFromTimestamp(request.timestamp)}</span>
							</div>
						)}

						{/* Your request - approved */}
						{request.approved &&
							!request.fulfilled &&
							contents.requestor === props.userId && (
								<FutureButton
									style={{ textTransform: 'uppercase' }}
									glow
									onClick={() => view(request.domain)}
								>
									Fulfill
								</FutureButton>
							)}

						{request.approved &&
							!request.fulfilled &&
							contents.requestor !== props.userId && (
								<div className={styles.Accepted}>
									<span>Accepted</span>
									<br />
									<span>{dateFromTimestamp(request.timestamp)}</span>
								</div>
							)}

						{/* Needs Approving */}
						{!request.approved && (
							<FutureButton
								style={{ textTransform: 'uppercase' }}
								glow
								onClick={() => view(request.domain)}
							>
								View Offer
							</FutureButton>
						)}
					</div>
				</td>
			</tr>
		</>
	);
};

export default React.memo(RequestTableRow);
