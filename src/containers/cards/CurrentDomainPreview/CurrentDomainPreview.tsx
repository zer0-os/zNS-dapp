import { useCurrentDomain } from 'lib/providers/CurrentDomainProvider';
import Preview from 'components/Preview/Preview';

const PreviewContainer = () => {
	const { domain, domainMetadata: metadata } = useCurrentDomain();

	if (!metadata || domain?.name === '') {
		return <></>;
	}

	return (
		<Preview
			title={metadata?.title}
			description={metadata?.description}
			icon={metadata?.previewImage ?? metadata?.image}
			banner={metadata?.image_full ?? metadata?.image}
			href={domain?.name && domain.name.split('wilder.')[1] + '?view=true'}
		/>
	);
};

export default PreviewContainer;
