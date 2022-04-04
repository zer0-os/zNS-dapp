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
	refetch: () => void;
	style?: React.CSSProperties;
	highestBid?: number;
	isLoading?: boolean;
	domainMetadata?: Maybe<Metadata>;
	setIsViewBidsOpen?: (state: boolean) => void;
	isViewBidsOpen?: boolean;
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
	setIsViewBidsOpen,
	isViewBidsOpen,
}: ViewBidButtonProps) => {
	const onClose = () => {
		if (setIsViewBidsOpen) {
			setIsViewBidsOpen(false);
		}
	};

	const onClick = () => {
		if (setIsViewBidsOpen) {
			setIsViewBidsOpen(true);
		}
	};

	const onAccept = () => {
		refetch();
		onClose();
	};

	return (
		<>
			{isViewBidsOpen && domainMetadata && bids && (
				<Overlay open={isViewBidsOpen} centered onClose={onClose}>
					<BidList
						bids={bids}
						domain={domain}
						domainMetadata={domainMetadata}
						onAccept={onAccept}
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
