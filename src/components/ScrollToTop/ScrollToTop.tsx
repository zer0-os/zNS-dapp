import { FC, useEffect } from 'react';
import { useLocation } from 'react-router';

export const ScrollToTop: FC = ({ children }) => {
	const location = useLocation();

	useEffect(() => {
		window.scrollTo(0, 0);
	}, [location]);

	return <>{children}</>;
};

export default ScrollToTop;
