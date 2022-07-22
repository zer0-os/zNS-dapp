import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';
import Preview from 'components/Preview/Preview';
import { getNetworkZNA } from 'lib/utils';

const PreviewContainer = () => {
	const { domain, domainMetadata: metadata } = useCurrentDomain();

	if (domain?.name === '') {
		return <></>;
	}

	return (
		<Preview
			title={metadata?.title}
			description={metadata?.description}
			icon={metadata?.previewImage ?? metadata?.image}
			banner={metadata?.image_full ?? metadata?.image}
			href={domain?.name && `${getNetworkZNA(domain.name)}?view=true`}
		/>
	);
};

export default PreviewContainer;
