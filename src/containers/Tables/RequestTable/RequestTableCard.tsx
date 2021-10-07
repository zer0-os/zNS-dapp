import RequestActions from './components/RequestActions';
import { NFTCard } from 'components';
import { useTableProvider } from './RequestTableProvider';

const RequestTableCard = (props: any) => {
	const { contents, request } = props.data;
	const {view } = useTableProvider();
	return (
		<>
			{request && (
				<NFTCard
					onClick={() => view(request.domain)}
					actionsComponent={
						<RequestActions onClick={view} request={props.data} />
					}
					metadataUrl={contents.metadata}
					domain={request.domain}
					price={100}
					nftOwnerId={contents.requestor}
					nftMinterId={contents.requestor}
					showCreator
					showOwner
					style={{ width: 380 }}
				/>
			)}
		</>
	);
};

export default RequestTableCard;
