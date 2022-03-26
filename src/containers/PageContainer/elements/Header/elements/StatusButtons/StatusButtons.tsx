//- React Imports
import React, { useMemo } from 'react';

//- Component Imports
import {
	MintPreview,
	TransferPreview,
	NumberButton,
	HoverDropdown,
} from 'components';

type StatusButtonsProps = {
	statusCounts: {
		minting: number;
		minted: number;
		stakeRequesting: number;
		stakeRequested: number;
		transferring: number;
	};
	onOpenProfile: () => void;
};

export const StatusButtons: React.FC<StatusButtonsProps> = ({
	statusCounts,
	onOpenProfile,
}) => {
	const { showStatusButton, showTransferringButton, statusCount } =
		useMemo(() => {
			const { minting, minted, stakeRequesting, stakeRequested, transferring } =
				statusCounts;

			const showStatusButton =
				minting + minted + stakeRequesting + stakeRequested > 0;
			const statusCount = minting + stakeRequesting;
			const showTransferringButton = transferring > 0;

			return {
				showStatusButton,
				showTransferringButton,
				statusCount,
			};
		}, [statusCounts]);

	const mintPreviewDropdownButton = (
		<NumberButton rotating={statusCount > 0} number={statusCount} />
	);
	const transferPreviewDropdownButton = (
		<NumberButton
			rotating={statusCounts.transferring > 0}
			number={statusCounts.transferring}
		/>
	);
	const mintPreviewDropdownContent = (
		<MintPreview onOpenProfile={onOpenProfile} />
	);
	const transferPreviewDropdownContent = <TransferPreview />;

	////////////
	// Render //
	////////////
	return (
		<>
			{/* Status / Long Running Operation Button */}
			{showStatusButton && (
				<HoverDropdown triggerContent={mintPreviewDropdownButton}>
					{mintPreviewDropdownContent}
				</HoverDropdown>
			)}

			{/* Transfer Progress button */}
			{showTransferringButton && (
				<HoverDropdown triggerContent={transferPreviewDropdownButton}>
					{transferPreviewDropdownContent}
				</HoverDropdown>
			)}
		</>
	);
};
