import { useState, useEffect } from 'react';

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

		const seconds = Math.floor((difference / 1000) % 60);
		const minutes = Math.floor((difference / 1000 / 60) % 60);
		const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
		const days = hours > 24 ? hours % 24 : 0;

		if (difference <= 0) {
			if (props.onFinish) {
				props.onFinish();
			}
			return '0s';
		}

		return `${days > 0 ? days + 'd ' : ''}${hours > 0 ? hours + 'h ' : ''}${
			minutes > 0 ? minutes + 'm ' : ''
		}${seconds}s`;
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
	}, [secondsCounted]);

	return <>{label}</>;
};

export default Countdown;
