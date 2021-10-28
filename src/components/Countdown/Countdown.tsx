import { useEffect, useState } from 'react';

type CountdownProps = {
	to: number;
	onFinish?: () => void;
};

const Countdown = (props: CountdownProps) => {
	const [label, setLabel] = useState<string | undefined>();
	const [secondsCounted, setSecondsCounted] = useState<number>(0);

	// Converts difference between two UTC timestamps into
	// [days]d [hours]h [minutes]m [seconds]s
	const getRemainingTimeAsString = () => {
		const difference = props.to - new Date().getTime();

		const totalSeconds = difference / 1000;
		const totalMinutes = totalSeconds / 60;
		const totalHours = totalMinutes / 60;
		const totalDays = (totalHours / 24) % 24;

		const seconds = Math.floor(totalSeconds % 60);
		const minutes = Math.floor(totalMinutes % 60);
		const hours = Math.floor(totalHours % 24);

		if (difference <= 0) {
			if (props.onFinish) {
				props.onFinish();
			}
			return '0s';
		}

		return `${totalDays > 1 ? Math.floor(totalDays) + 'd ' : ''}${
			hours > 0 ? hours + 'h ' : ''
		}${minutes > 0 ? minutes + 'm ' : ''}${seconds}s`;
	};

	useEffect(() => {
		let isActive = true;
		if (!label) {
			if (isActive) {
				setLabel(getRemainingTimeAsString());
			}
		}
		setTimeout(() => {
			if (isActive) {
				setLabel(getRemainingTimeAsString());
				setSecondsCounted(secondsCounted + 1);
			}
		}, 1000);
		return () => {
			isActive = false;
		};
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [secondsCounted]);

	return <>{label}</>;
};

export default Countdown;
