import { useContext } from 'react';
import { MvpVersionContext } from 'lib/providers/MvpVersionProvider';

function useMvpVersion() {
	const { mvpVersion, setMvpVersion } = useContext(MvpVersionContext);
	return { mvpVersion, setMvpVersion };
}

export default useMvpVersion;
