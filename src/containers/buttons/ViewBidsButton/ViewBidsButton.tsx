//- Components Imports
import { FutureButton, TextButton } from 'components';

//- Constants Imports
import { LABELS } from './ViewBidsButton.constants';

interface ViewBidButtonProps {
	onClick: (event?: any) => void;
	buttonText?: string;
	className?: string;
	isTextButton?: boolean;
	style?: React.CSSProperties;
}

const ViewBidsButton = ({
	onClick,
	className,
	isTextButton,
	style,
	buttonText,
}: ViewBidButtonProps) => {
	return (
		<>
			{isTextButton ? (
				<TextButton style={style} className={className} onClick={onClick}>
					{buttonText ?? LABELS.BUTTON_TEXT}
				</TextButton>
			) : (
				<FutureButton
					style={style}
					className={className}
					glow
					onClick={onClick}
				>
					{buttonText ?? LABELS.BUTTON_TEXT}
				</FutureButton>
			)}
		</>
	);
};

export default ViewBidsButton;
