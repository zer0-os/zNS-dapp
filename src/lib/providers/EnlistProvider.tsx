//- React Imports
import React, { useState } from 'react';

//- Type Imports
import { Domain, DefaultDomain } from 'lib/types';

// emailjs
import emailjs from 'emailjs-com';

emailjs.init(process.env.REACT_APP_EMAILJS_USER!);

type context = {
	enlisting: Domain | undefined;
	enlist: (domain: Domain) => void;
	submit: (params: EnlistSubmitParams) => Promise<void>;
	clear: () => void;
};

export interface EnlistSubmitParams {
	email: string;
	reason: string;
	bid: number;
}

export const EnlistContext = React.createContext<context>({
	enlisting: DefaultDomain || undefined,
	enlist: (domain: Domain) => {},
	submit: async (params: EnlistSubmitParams) => {},
	clear: () => {},
});

type EnlistProviderType = {
	children: React.ReactNode;
};

const EnlistProvider: React.FC<EnlistProviderType> = ({ children }) => {
	const [enlisting, setEnlisting] = useState<Domain | undefined>(undefined);

	const enlist = (domain: Domain) => {
		setEnlisting(domain);
	};

	const clear = () => setEnlisting(undefined);

	const submit = async (params: EnlistSubmitParams) => {
		const doSubmitAsync = async () => {
			try {
				await emailjs.send('service_jv0jl5c_wwwlg', 'template_8txuvny', {
					user_email: params.email,
					bid: params.bid,
					reason: params.reason,
					domain_name: `0://${enlisting!.name}`,
				});
			} catch (e) {
				console.error(`Failed to enlist: ${e.text}`);
			}
		};
		doSubmitAsync();

		clear();
	};

	const contextValue = {
		enlisting,
		enlist,
		submit,
		clear,
	};

	return (
		<EnlistContext.Provider value={contextValue}>
			{children}
		</EnlistContext.Provider>
	);
};

export default EnlistProvider;
