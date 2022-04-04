//- React Imports
import { useState } from 'react';

//- Containers Imports
import { BidList } from 'containers';

//- Library Imports
import { Bid } from '@zero-tech/zns-sdk/lib/zAuction';
import { Maybe, Metadata } from 'lib/types';
import { Domain } from '@zero-tech/zns-sdk/lib/types';

//- Components Imports
import { FutureButton, Overlay, TextButton } from 'components';

//- Constants Imports
import { LABELS } from './ViewBidsButton.constants';

interface ViewBidButtonProps {
	bids?: Bid[];
	domain?: Domain;
	buttonText?: string;
	className?: string;
	isTextButton?: boolean;
	refetch?: () => void;
	style?: React.CSSProperties;
	highestBid?: number;
	isLoading?: boolean;
	domainMetadata?: Maybe<Metadata>;
}

const ViewBidsButton = ({
	bids,
	domain,
	buttonText,
	className,
	isTextButton,
	refetch,
	style,
	highestBid,
	isLoading,
	domainMetadata,
}: ViewBidButtonProps) => {
	const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

	const onClose = () => {
		setIsModalOpen(false);
	};

	const onClick = () => {
		setIsModalOpen(true);
	};

	return (
		<>
			{isModalOpen && domainMetadata && bids && (
				<Overlay open={isModalOpen} centered onClose={onClose}>
					<BidList
						bids={bids}
						domain={domain}
						domainMetadata={domainMetadata}
						onAccept={refetch}
						highestBid={String(highestBid)}
						isLoading={isLoading}
					/>
				</Overlay>
			)}
			{isTextButton ? (
				<TextButton style={style} className={className} onClick={onClick}>
					{buttonText ? buttonText : LABELS.BUTTON_TEXT}
				</TextButton>
			) : (
				<FutureButton
					style={style}
					className={className}
					glow
					onClick={onClick}
				>
					{buttonText ? buttonText : LABELS.BUTTON_TEXT}
				</FutureButton>
			)}
		</>
	);
};

export default ViewBidsButton;
