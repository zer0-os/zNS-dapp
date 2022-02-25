import { LoadingIndicator } from 'components';
import React from 'react';

type LoadingProps = {
	message: React.ReactNode | string;
};

const Loading = ({ message }: LoadingProps) => (
	<LoadingIndicator text={message} />
);

export default Loading;
