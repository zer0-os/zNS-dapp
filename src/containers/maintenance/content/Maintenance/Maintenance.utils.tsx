//- Constants Imports
import { URLS } from 'constants/urls';
import { LABELS, ATTRIBUTES } from './Maintenance.constants';

export const getLinkText = () => (
	<>
		{LABELS.FOLLOW_OUR}
		<a href={URLS.DISCORD} target={ATTRIBUTES.TARGET} rel={ATTRIBUTES.REL}>
			{LABELS.DISCORD}
		</a>
		{LABELS.FURTHER_UPDATES}
	</>
);
