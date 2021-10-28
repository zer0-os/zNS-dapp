/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';

import styles from './CountdownBanner.module.scss';

import arrow from './assets/bidarrow.svg';

import CountdownData from './countdown.json';

const CountdownBanner = () => {
	//////////////////
	// State & Data //
	//////////////////

	const history = useHistory();

	// Trigger for effect loop
	const [secondsCounted, setSecondsCounted] = useState<number>(0);

	// We shouldn't show banner outside of pre countdown and after countdown times
	const [shouldShowBanner, setShouldShowBanner] = useState<boolean>(false);

	// Variables to render in banner
	const [text, setText] = useState<string | undefined>();
	const [buttonText, setButtonText] = useState<string | undefined>();
	const [buttonLink, setButtonLink] = useState<string | undefined>(
		CountdownData.domain,
	);
	const [timeRemainingLabel, setTimeRemainingLabel] = useState<
		string | undefined
	>();

	// Grab start and end from JSON file
	const startTime = CountdownData.startTimeUTC;
	const endTime = CountdownData.endTimeUTC;

	// Had to break the flow of the file for this to be used below
	const hoursToMilliseconds = (hrs: number) => {
		return hrs * 3600000;
	};

	// Calculated times from JSON file
	const preStartTime =
		startTime - hoursToMilliseconds(CountdownData.pre.hoursVisible);
	const postEndTime =
		endTime + hoursToMilliseconds(CountdownData.after.hoursVisible);

	///////////////
	// Functions //
	///////////////

	// Converts difference between two UTC timestamps into
	// [days]d [hours]h [minutes]m [seconds]s
	const getRemainingTimeAsString = (from: number, to: number) => {
		const difference = to - from;

		const seconds = Math.floor((difference / 1000) % 60);
		const minutes = Math.floor((difference / 1000 / 60) % 60);
		const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
		const days = hours > 24 ? hours % 24 : 0;

		if (difference <= 0) {
			return '0s';
		}

		return `${days > 0 ? days + 'd ' : ''}${hours > 0 ? hours + 'h ' : ''}${
			minutes > 0 ? minutes + 'm ' : ''
		}${seconds}s`;
	};

	// Navigates to button link
	const onClick = () => {
		if (buttonLink) {
			history.push(buttonLink);
		}
	};

	/////////////
	// Effects //
	/////////////

	useEffect(() => {
		let isActive = true;
		setTimeout(() => {
			if (isActive) {
				const now = new Date().getTime();
				let countingDownTo;
				// @todo refactor - this is messy
				if (now < preStartTime) {
					// Nothing
					setShouldShowBanner(false);
				} else if (now < startTime) {
					// Pre-drop banner
					countingDownTo = startTime;
					setText(CountdownData.pre.label);
					setButtonText(CountdownData.during.button);
					setButtonLink(CountdownData.domain);
				} else if (now < endTime) {
					// Auction countdown
					countingDownTo = endTime;
					setText(CountdownData.during.label);
					setButtonText(CountdownData.during.button);
					setButtonLink(CountdownData.domain);
				} else if (now < postEndTime) {
					// Post auction banner
					setText(CountdownData.after.label);
					setButtonText(CountdownData.after.button);
					setButtonLink(CountdownData.domain);
					setTimeRemainingLabel(undefined);
				} else {
					// Nothing
					setShouldShowBanner(false);
				}
				if (countingDownTo) {
					const remaining = getRemainingTimeAsString(now, countingDownTo);
					setTimeRemainingLabel(remaining);
					setShouldShowBanner(true);
				}
				setSecondsCounted(secondsCounted + 1);
			}
		}, 1000);
	}, [secondsCounted]);

	////////////
	// Render //
	////////////

	if (!shouldShowBanner) return <></>;

	return (
		<div
			style={{ marginBottom: 16 }}
			onClick={onClick}
			className={`${styles.nextDrop} border-rounded`}
		>
			<span>
				{text}{' '}
				{timeRemainingLabel && (
					<b className={styles.Remaining}>{timeRemainingLabel}</b>
				)}
				{buttonText && (
					<b className={styles.Bid}>
						{buttonText}
						<img alt="arrow" className={styles.Arrow} src={arrow} />
					</b>
				)}
			</span>
			<div className={styles.Background}></div>
		</div>
	);
};

export default React.memo(CountdownBanner);
