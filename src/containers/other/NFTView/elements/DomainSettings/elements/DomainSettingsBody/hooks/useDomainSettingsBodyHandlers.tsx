type UseDomainSettingsBodyHandlersProps = {
	props: {
		isLocked: boolean;
		onShowLockedWarning: () => void;
	};
	localActions: {};
};

export const useDomainSettingsBodyHandlers = ({
	props,
	localActions,
}: UseDomainSettingsBodyHandlersProps) => {
	const handleBodyClicking = () => {
		if (props.isLocked) {
			props.onShowLockedWarning();
		}
	};

	return {
		handleBodyClicking,
	};
};
