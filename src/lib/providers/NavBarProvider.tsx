import React, {
	Dispatch,
	FC,
	SetStateAction,
	useContext,
	useState,
} from 'react';

export const NavBarContext = React.createContext<{
	title: undefined | string;
	setTitle: Dispatch<SetStateAction<string | undefined>>;
}>({
	title: undefined,
	setTitle: () => undefined,
});

export const NavBarProvider: FC = ({ children }) => {
	const [title, setTitle] = useState<string>();

	return (
		<NavBarContext.Provider value={{ title, setTitle }}>
			{children}
		</NavBarContext.Provider>
	);
};

export function useNavBarContents() {
	return useContext(NavBarContext);
}
