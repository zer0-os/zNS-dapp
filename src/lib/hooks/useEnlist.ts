import { useContext } from 'react';
import { EnlistContext } from 'lib/providers/EnlistProvider';

function useEnlist() {
	const { enlisting, enlist, submit, clear } = useContext(EnlistContext);
	return { enlisting, enlist, submit, clear };
}

export default useEnlist;
