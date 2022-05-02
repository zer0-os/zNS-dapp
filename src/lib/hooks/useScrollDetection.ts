//- React Imports
import { useEffect } from 'react';

var lastY = 0; // Just a global variable to stash last scroll position

const useScrollDetection = (setIsScrollDown: (state: boolean) => void) => {
	//- Data
	const body = document.getElementsByTagName('body')[0];

	const handleScroll = () => {
		if (body.scrollTop > 60 && body.scrollTop > lastY) {
			// Going down and at least 60 pixels
			lastY = body.scrollTop;
			setIsScrollDown(true);
		} else if (lastY - body.scrollTop >= 10) {
			// Going up and more than 10 pixel
			lastY = body.scrollTop;
			setIsScrollDown(false);
		}
	};

	useEffect(() => {
		body.addEventListener('scroll', handleScroll);
		return () => body.removeEventListener('scroll', handleScroll);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);
};

export default useScrollDetection;
