import RequestActions from './components/RequestActions';
import { NFTCard } from 'components';

const RequestTableCard = (props: any) => {
	const { contents, request } = props.data;
	return (
		<>
			{request && (
				<NFTCard
					onClick={() => props.view(request.domain)}
					actionsComponent={
						<RequestActions onClick={props.view} request={props.data} />
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
