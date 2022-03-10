import { LoadingIndicator } from 'components';
import React from 'react';

type LoadingProps = {
	message: React.ReactNode | string;
	subtext?: React.ReactNode | string;
};

const Loading = ({ message, subtext }: LoadingProps) => (
	<LoadingIndicator text={message} subtext={subtext} />
);

export default Loading;
